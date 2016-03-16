class SelectionsController < ApplicationController
  def index
    night = FilmNight.getCurrent(5)
    sels = night.selections.joins("LEFT JOIN votes ON selection_id = selections.id AND user_id = '#{current_user.id}'").joins(:film).order("votes.position asc").select("films.*, selections.id AS selection_id, votes.position IS NOT NULL AS voted")
    logger.info sels.to_json
    voted = sels.all? { |sel| sel.voted > 0 }
    render json: {status: 'success', filmList: sels, hasVoted: voted}
  end
  
  def create
  
  end
end
