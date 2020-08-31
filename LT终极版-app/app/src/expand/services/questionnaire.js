import { MarketClient } from './client'

const FETCH_QUIT_PLAN = `${
  MarketClient.ORIGIN
}/hps/questionnaire/app/quit_plans.json`

const FETCH_FREESERVICE_A = `${
  MarketClient.ORIGIN
}/hps/questionnaire/app/free_service_question_a.json`

const FETCH_FREESERVICE_B = `${
  MarketClient.ORIGIN
}/hps/questionnaire/app/free_service_question_b.json`

export default {
  FETCH_QUIT_PLAN,
  FETCH_FREESERVICE_A,
  FETCH_FREESERVICE_B
}
