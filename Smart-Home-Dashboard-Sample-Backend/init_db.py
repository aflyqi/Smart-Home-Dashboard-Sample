from database import engine, SessionLocal
from models import Base, User
from auth import get_password_hash

# 创建所有表
def init_db():
    Base.metadata.create_all(bind=engine)
    
    # 创建数据库会话
    db = SessionLocal()
    
    try:
        # 检查是否已经有测试用户
        test_user = db.query(User).filter(User.username == "test").first()
        
        if not test_user:
            # 创建测试用户
            test_user = User(
                username="test",
                email="test@example.com",
                hashed_password=get_password_hash("test123")
            )
            db.add(test_user)
            db.commit()
            print("Created test user: username='test', password='test123'")
        else:
            print("Test user already exists")
            
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed!") 