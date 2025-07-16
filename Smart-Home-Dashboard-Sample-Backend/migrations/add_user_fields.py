import sqlite3
import os

def migrate():
    # 获取数据库文件路径
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'smart_home.db')
    
    # 连接到数据库
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 检查 avatar_url 列是否存在
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]
        
        # 添加 avatar_url 列（如果不存在）
        if 'avatar_url' not in column_names:
            cursor.execute('''
                ALTER TABLE users
                ADD COLUMN avatar_url VARCHAR DEFAULT NULL
            ''')
            print("Added avatar_url column")
        
        # 添加 background_image 列（如果不存在）
        if 'background_image' not in column_names:
            cursor.execute('''
                ALTER TABLE users
                ADD COLUMN background_image VARCHAR DEFAULT NULL
            ''')
            print("Added background_image column")
        
        # 提交更改
        conn.commit()
        print("Migration completed successfully")
        
    except Exception as e:
        # 如果出现错误，回滚更改
        conn.rollback()
        print(f"Migration failed: {str(e)}")
        raise
    finally:
        # 关闭数据库连接
        conn.close()

if __name__ == "__main__":
    migrate() 