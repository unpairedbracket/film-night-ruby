class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :selection, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.integer :position

      t.timestamps null: false
    end
  end
end
