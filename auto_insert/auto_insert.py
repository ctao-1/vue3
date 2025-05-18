import psycopg2
import locale
print("系统默认编码:", locale.getpreferredencoding())
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
# 数据库连接信息
conn = psycopg2.connect(dbname="postgres",user="postgres",password="123456",host="localhost",port="5432")
cur = conn.cursor()

# 读取图片文件为二进制
with open('二郎滩.jpg', 'rb') as f:
    binary_data = f.read()

# 插入数据
sql = """
INSERT INTO changzhenluarmy1 (place_name, coordinate,elevation, incident, incident_data, description, image)
VALUES (%s, ST_GeogFromText('SRID=4326;POINT(%s %s)'),%s, %s, %s, %s, %s)
"""
# sql = """
# update changzhenluarmy1 set image = (%s) where place_name = '习水县土城镇'
# """

cur.execute(sql, (
    '二郎镇二郎滩', #地名
    106.1500,28.1667,  # 经纬度
    355,  # 海拔
    '四渡赤水', # 事件
    '1935-03-10',# 事件时间
    '红军在此进行第四次渡赤水行动，成功摆脱敌军追击。', # 事件描述
    # None,
    psycopg2.Binary(binary_data)
))
    
conn.commit()
cur.close()
conn.close()
