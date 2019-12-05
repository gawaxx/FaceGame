# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

ScoreBoard.destroy_all
puts "Cleaned all scoreboards"


User.destroy_all
puts "Cleaned all users"


# user1 = User.create(name: "Bob")
# puts "Created one user"

scoreboard1 = ScoreBoard.create(count: 0, name: "Bob")
puts "Created one scoreboard"
