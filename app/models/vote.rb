class Vote < ActiveRecord::Base
  belongs_to :selection
  belongs_to :user
  
  def self.getResults(night)
    votesByUser = night.selections.flat_map { |sel| sel.votes } .group_by { |vote| vote.user }
    votesHash = votesByUser.values.map { |voteset| Hash[voteset.map { |vote| [vote.selection.film.imdbid, vote.position] }] }
  end
end
