import psycopg2
import locale
print("系统默认编码:", locale.getpreferredencoding())
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
# 数据库连接信息
conn = psycopg2.connect(dbname="postgres",user="postgres",password="123456",host="localhost",port="5432")
cur = conn.cursor()

# 读取图片文件为二进制
with open('zunyihuiyidizhi.jpg', 'rb') as f:
    binary_data = f.read()

# 插入数据
sql = """
INSERT INTO changzhenluarmy1 (place_name, coordinate, incident, incident_data, description, image)
VALUES (%s, ST_GeogFromText('SRID=4326;POINT(%s %s)'), %s, %s, %s, %s)
"""

cur.execute(sql, (
    '遵义', 
    106.918056,27.698611,  # 经纬度
    '遵义会议', 
    '1935-01-15',
    '遵义会议是中国共产党历史上一个重要的会议，标志着中国共产党开始独立自主地进行军事斗争和政治斗争。', 
    psycopg2.Binary(binary_data)
))

conn.commit()
cur.close()
conn.close()
