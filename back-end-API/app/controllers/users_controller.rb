class UsersController < ApplicationController
    
    def index
        users = User.all
        render json: users
    end 

    def show 
        user = User.find_by(id: params[:id])
        render json: user
    end

    def create
        new_user = User.create(name: params[:name])
        render json: new_user
    end 

end
