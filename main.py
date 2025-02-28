import asyncio
import logging
import aiomysql
from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.types import InputFile


API_TOKEN = '7778995202:AAE0_w8cq4Z6VVMnmVw9MHe-zEU7Te1HR5g'

DB_CONFIG = {
    "host": "swd9q.h.filess.io",
    "user": "miniapps_shutasleep",
    "password": "e697055c15eee0eba19686d395e4b096c305189d",
    "port": 3307,
    "db": "miniapps_shutasleep" 
}


logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher()


router = Router()


async def connect_db():
    try:
        logging.debug(f"Попытка подключения к базе данных с параметрами: {DB_CONFIG}")
        conn = await aiomysql.connect(**DB_CONFIG) 
        logging.info("✅ Успешное подключение к базе данных!")
        return conn
    except aiomysql.MySQLError as e:
        logging.error(f"❌ Ошибка MySQL при подключении: {e}")
    except Exception as e:
        logging.error(f"❌ Ошибка подключения к базе данных: {e}")
    return None


async def create_table():
    conn = await connect_db()
    if conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS leaderboard (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    score INT NOT NULL
                )
                """
            )
            await conn.commit()
        conn.close()

async def update_score(user_id: int, username: str, score: int):
    conn = await connect_db()
    if conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                "INSERT INTO leaderboard (user_id, username, score) VALUES (%s, %s, %s) "
                "ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score))",
                (user_id, username, score)
            )
            await conn.commit()
        conn.close()

async def get_leaderboard():
    conn = await connect_db()
    if conn:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
            top_players = await cursor.fetchall()
        conn.close()
        return top_players
    return []

keyboard = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="🔵 Играть", web_app=WebAppInfo(url="https://meycoder.github.io/webgame-zm"))],
    [InlineKeyboardButton(text="🔵 Таблица лидеров", callback_data="leaderboard")]
])


@dp.message(F.text == "/start")
async def send_welcome(message: types.Message):
    photo_url = "https://i.postimg.cc/ZKQLTFhx/image.png"

    try:
        # Отправляем изображение по URL
        await message.answer_photo(
            photo_url,
            caption="Добро пожаловать! В SnakeGame.",
            reply_markup=keyboard
        )
    except Exception as e:
        print(f"Ошибка: {e}")




@router.callback_query(F.data == "leaderboard")
async def leaderboard_callback(callback: types.CallbackQuery):
    leaderboard = await get_leaderboard()
    if leaderboard:
        leaderboard_text = "🏆 **Таблица лидеров** 🏆\n\n" + "\n".join([f"{i+1}. {player[0]} — {player[1]} очков" for i, player in enumerate(leaderboard)])
    else:
        leaderboard_text = "Пока нет данных о лучших игроках. Попробуйте позже."

    await callback.message.answer(leaderboard_text)

dp.include_router(router)

async def main():
  
    await create_table()
    
    logging.info("Бот запущен...")
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
