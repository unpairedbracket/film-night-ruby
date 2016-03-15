class ProposalsController < ApplicationController
  def new
  end
  
  def create
    proposals = []
    params["proposal"].each do |proposal|
      film = Film.find_or_create_by(imdbid: proposal["id"])
      prop = Proposal.find_or_create_by(film_id: film.id, user_id: current_user.id)
      prop.veto = proposal["veto"]
      prop.save
      proposals << prop
    end
    render json: proposals
  end
end
