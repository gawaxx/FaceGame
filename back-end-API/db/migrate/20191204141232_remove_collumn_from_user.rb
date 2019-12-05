class RemoveCollumnFromUser < ActiveRecord::Migration[6.0]
  def change

    remove_column :users, :score_board_id, :integer
  end
end
