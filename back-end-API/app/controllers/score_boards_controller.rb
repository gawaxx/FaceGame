class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: scoreboards
    end 

    def show 
        scoreboard = ScoreBoard.find_by(id: params[:id])
        render json: { id: scoreboard.id, name: scoreboard.user.name, count: scoreboard.count }
    end

    def create
        new_scoreboard = ScoreBoard.new 
        new_scoreboard.user_id = 3
        render json: new_scoreboard
        # new_pokemon = Pokemon.new
        # new_pokemon.nickname = Faker::Name.first_name
        # new_pokemon.species = Faker::Games::Pokemon.name
        # new_pokemon.trainer_id = params[:id]
        # new_pokemon.save
        # render json: new_pokemon
    end 

end
