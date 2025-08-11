#! /bin/bash
export MODE=$1
export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_USERNAME=dev
export DB_PASSWORD=password
export DB_NAME=rent_building

export DB_ENDPOINT="mysql://$DB_USERNAME:$DB_PASSWORD@tcp($DB_HOST:$DB_PORT)/$DB_NAME"
echo $DB_ENDPOINT
wait_for_db() {
    local db_host="$1"
    local db_port="$2"
    local db_user="$3"
    local max_retries="${4:-30}"      # ใช้ 30 ถ้าไม่ได้ระบุ
    local retry_interval="${5:-1}"    # ใช้ 1 ถ้าไม่ได้ระบุ
    echo "$db_host $db_port $db_user $max_retries $retry_interval"
    echo "--- กำลังรอให้ Database ($db_host:$db_port) พร้อมใช้งาน ---"
    for i in $(seq 1 $max_retries); do
        if mysqladmin ping -h "$db_host" -P "$db_port" -u "$db_user" --password="$DB_PASSWORD" --silent; then
            echo "✅ Database พร้อมใช้งานแล้ว!"
            return 0 # คืนค่า 0 (สำเร็จ)
        else
            echo "⏳ Database ยังไม่พร้อม. กำลังรอ $retry_interval วินาที... (ครั้งที่ $i/$max_retries)"
            sleep "$retry_interval"
        fi
    done

    echo "❌ หมดเวลา! Database ไม่พร้อมใช้งานหลังจาก $max_retries ครั้ง."
    return 1 # คืนค่า 1 (ล้มเหลว)
}

install_migrate() {
    curl -s https://packagecloud.io/install/repositories/golang-migrate/migrate/script.deb.sh | sudo bash
    sudo apt-get update
    sudo apt-get install -y migrate
}

run_migrate() { 
    if [ "$1" == "up" ]; then
        echo '[UP] Migration]'
        echo 'Start migration UP...'
        if migrate -database "$DB_ENDPOINT" -path scripts/db/migrations up; then
            echo 'Migration UP finished successfully.'
        else
            echo "Error: Migration UP failed!"
            exit 1 
        fi
    elif [ "$1" == "down" ]; then
        echo '[DOWN] Migration'
        echo 'Start migration DOWN...'
        if migrate -database "$DB_ENDPOINT" -path scripts/db/migrations down; then
            echo 'Migration DOWN finished successfully.'
        else
            echo "Error: Migration DOWN failed!"
            exit 1
        fi
    else
        echo "MODE: " $1
        echo "Error: Unexpected mode! Please use 'up' or 'down'."
        exit 1 
    fi
}

if command -v migrate &>/dev/null; then
    if wait_for_db "$DB_HOST" "$DB_PORT" "$DB_USER" 45 2; then
        run_migrate $MODE
    fi
else
    install_migrate 
    if wait_for_db "$DB_HOST" "$DB_PORT" "$DB_USER" 45 2; then
        run_migrate $MODE
    fi
fi
