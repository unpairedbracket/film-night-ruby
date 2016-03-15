class VotesController < ApplicationController
  def new
    render layout: !request.xhr?
  end
end
