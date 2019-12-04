# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

ScoreBoard.destroy_all
put "Cleaned all scoreboards"

User.destroy_all
put "Cleaned all users"

scoreboard1 = ScoreBoard.create(count: 0, user_id: 1)
put "Created one scoreboard"

user1 = User.create(name: "Bob")
put "Created one user"

