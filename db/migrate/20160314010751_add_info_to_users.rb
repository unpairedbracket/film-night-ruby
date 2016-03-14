class AddInfoToUsers < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.string :name
      t.string :image
    end
  end
end
