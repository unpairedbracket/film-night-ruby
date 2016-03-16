class VotesController < ApplicationController
  def index
    if (current_user.admin && !params[:night])
      results = Vote.getResults(FilmNight.getCurrent);
    else
      results = Vote.getResults(FilmNight.getCurrentResults(params[:night]));
    end
    render json: {status: "success", votes: results};
  end
  
  def new
    @type = "voting"
    render layout: !request.xhr?
  end
  
  def create
    night = FilmNight.getCurrent
    night.selections.each do |selection|
      pos = params[:vote][selection.id.to_s]
      vote = selection.votes.find_or_initialize_by(user_id: current_user.id)
      vote.position = pos
      vote.save
    end
    render json: {status: 'success'}
  end
  
  def delete
    night = FilmNight.getCurrent
    current_user.votes.joins(:selection).where("selections.film_night_id=?", night.id).delete_all
    render json: {status: 'success'}
  end
  
  def results
    @type = "results"
    render layout: !request.xhr?
  end
end
