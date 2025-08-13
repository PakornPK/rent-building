#!/bin/bash

# สร้าง private key (RSA 4096 bit)
openssl genpkey -algorithm RSA -out jwt_private.key -pkeyopt rsa_keygen_bits:4096

# สร้าง public key จาก private key
openssl rsa -pubout -in jwt_private.key -out jwt_public.key

echo "สร้างไฟล์ jwt_private.key และ jwt_public.key สำเร็จแล้ว"

# อ่านค่า key และแปะลงไฟล์ .env
PRIVATE_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' jwt_private.key)
PUBLIC_KEY=$(awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' jwt_public.key)

# ลบค่าเดิมออกก่อน (ถ้ามี)
sed -i '/^AUTH_PRIVATE_KEY=/d' .env
sed -i '/^AUTH_PUBLIC_KEY=/d' .env

# แปะค่าใหม่ลง .env
echo "" >> .env
echo "AUTH_PRIVATE_KEY=\"$PRIVATE_KEY\"" >> .env
echo "AUTH_PUBLIC_KEY=\"$PUBLIC_KEY\"" >> .env

echo "เพิ่มค่า AUTH_PRIVATE_KEY และ AUTH_PUBLIC_KEY ในไฟล์ .env สำเร็จแล้ว"