class AddVetoToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :veto, :boolean
  end
end
