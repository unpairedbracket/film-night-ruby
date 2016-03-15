class CreateProposals < ActiveRecord::Migration
  def change
    create_table :proposals do |t|
      t.references :user, index: true, foreign_key: true
      t.references :film, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
