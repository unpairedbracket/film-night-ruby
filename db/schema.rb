# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160315232329) do

  create_table "film_nights", force: :cascade do |t|
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.datetime "roll_call_start"
    t.datetime "roll_call_end"
    t.datetime "voting_start"
    t.datetime "voting_end"
    t.datetime "results_start"
    t.datetime "results_end"
  end

  create_table "films", force: :cascade do |t|
    t.string   "imdbid"
    t.string   "title"
    t.integer  "year"
    t.boolean  "enabled"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "proposals", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "film_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean  "veto"
  end

  add_index "proposals", ["film_id"], name: "index_proposals_on_film_id"
  add_index "proposals", ["user_id"], name: "index_proposals_on_user_id"

  create_table "selections", force: :cascade do |t|
    t.integer  "film_id"
    t.integer  "film_night_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "selections", ["film_night_id"], name: "index_selections_on_film_night_id"

  create_table "users", force: :cascade do |t|
    t.string   "email",      default: "",    null: false
    t.string   "password",   default: "",    null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "image"
    t.boolean  "admin",      default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true

  create_table "votes", force: :cascade do |t|
    t.integer  "selection_id"
    t.integer  "user_id"
    t.integer  "position"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "votes", ["selection_id"], name: "index_votes_on_selection_id"
  add_index "votes", ["user_id"], name: "index_votes_on_user_id"

end
