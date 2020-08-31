import { observable, action } from 'mobx'

class BrandsStore {
  @observable brands = []
  @observable page = 0
  @observable per_page = 50
  @observable sort = 'name_asc'
  /*
    name_asc
    Sort by name asc

    latest
    Sort by updated_at desc
  */

  @action
  addBrands = brands => {
    this.brands = [...this.brands, ...brands]
  }

  @action
  cleanBrands = () => {
    this.brands = []
    this.page = 0
  }
}

export default new BrandsStore()
