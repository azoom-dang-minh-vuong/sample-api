set -e

DB_CONTAINER_NAME="test-sample-mysql"
ORIGINAL_DB_NAME="test-sample-db"
DB_USER="root"
DB_PASSWORD="test-password"

if [ "$NODE_ENV" = "test" ]; then
    # running in local
    export _CONTAINER_IMAGE_NAME="test-sample-api"
    docker compose -f ./cicd/test/docker-compose.yaml down
    rm -rf ./cicd/test/data
    mkdir -p ./cicd/test/data
    docker compose -f ./cicd/test/docker-compose.yaml up -d $DB_CONTAINER_NAME
    echo "Waiting for $DB_CONTAINER_NAME to become healthy..."
    sleep 10
    attempts=0
    max_attempts=60
    while ((attempts < max_attempts)); do
        status=`docker ps --filter "name=$DB_CONTAINER_NAME" --format "{{.Status}}"`
        if [[ $status == *healthy* ]]; then
            echo Container $DB_CONTAINER_NAME is healthy.
            break
        fi
        sleep 1
        attempts=$((attempts+1))
        echo Waiting for $DB_CONTAINER_NAME to become healthy. attempts: $attempts
    done

    if (( attempts == max_attempts )); then
        echo Container $DB_CONTAINER_NAME did not become healthy.
        exit 1
    fi
fi

if [ "$NODE_ENV" = "test" ]; then
    # running in local
    HOST="localhost"
else
    # running in CI container
    HOST="$DB_CONTAINER_NAME"
    # download mysql-client
    # apt-get install -y -q --no-install-recommends apt-utils
    # apt-get install -y -q default-mysql-client
    apk add mysql-client
fi

migrate_db() {
    concat_all_migration_scripts() {
        for file in ./prisma/migrations/*/*.sql; do
            cat "$file";
            printf "\n;\n";
        done
    }

    printf "Migrating..."
    if [ "$NODE_ENV" = "test" ]; then
        concat_all_migration_scripts > cicd/test/data/migrate.sql
        local migrate_script="mysql $ORIGINAL_DB_NAME --host=$HOST --port=3306 -u$DB_USER -p$DB_PASSWORD < /var/lib/mysql/migrate.sql 2> /dev/null"
        docker exec $DB_CONTAINER_NAME bash -c "$migrate_script"
    else
        concat_all_migration_scripts > migrate.sql
        mysql $ORIGINAL_DB_NAME --host=$HOST --port=3306 -u$DB_USER -p$DB_PASSWORD < migrate.sql 
    fi
    yarn prisma:generate > /dev/null
    echo "  Done!"
}

dump_original_db () {
    printf "Dumping database $ORIGINAL_DB_NAME ..."
    local dump_script="mysqldump $ORIGINAL_DB_NAME --host=$HOST --port=3306 -u$DB_USER -p$DB_PASSWORD --ignore-table=${ORIGINAL_DB_NAME}._prisma_migrations --result-file=dump.sql"
    if [ "$NODE_ENV" = "test" ]; then
        docker exec $DB_CONTAINER_NAME bash -c "$dump_script 2> /dev/null"
    else
        eval $dump_script
    fi
    echo "  Done!"
}

create_db () {
    for (( i = 1; i < ${JEST_MAX_WORKERS=3}; i++)) do
        CLONE_DB_NAME="$ORIGINAL_DB_NAME-$i"
        printf "Creating database $CLONE_DB_NAME ..."

        local create_script="mysqladmin create $CLONE_DB_NAME --host=$HOST --port=3306 -u$DB_USER -p$DB_PASSWORD"
        local migrate_script="mysql $CLONE_DB_NAME --host=$HOST --port=3306 -u$DB_USER -p$DB_PASSWORD < dump.sql"

        if [ "$NODE_ENV" = "test" ]; then
            docker exec $DB_CONTAINER_NAME bash -c "$create_script 2> /dev/null"
            docker exec $DB_CONTAINER_NAME bash -c "$migrate_script 2> /dev/null"
        else
            eval $create_script
            eval $migrate_script
        fi
        echo "  Done!"
    done
}

migrate_db
dump_original_db
create_db
