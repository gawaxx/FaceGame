class RemoveColumnFromScoreBoard < ActiveRecord::Migration[6.0]
  def change

    remove_column :score_boards, :user_id, :integer
  end
end
