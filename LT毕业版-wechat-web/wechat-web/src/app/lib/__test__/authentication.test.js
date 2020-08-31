import {
  isValidSubscriber,
  isExpiredSubscriber,
  isSubscriber,
  expiresInDays,
  isVacation,
  isSpecialUser
} from '../authentication'
import { addDays } from 'date-fns'

describe('test customer isSubscriber', () => {
  let customer = {}
  it('非会员', () => {
    expect(isSubscriber(customer)).toEqual(false)
    customer['subscription'] = {
      id: 3
    }
    expect(isSubscriber(customer)).toEqual(true)
  })
})

describe('test customer isValidSubscriber', () => {
  let customer = {}
  it('非会员', () => {
    expect(isValidSubscriber(customer)).toEqual(false)
  })
  it('会员情况， status === trial', () => {
    customer['subscription'] = {
      id: 3,
      status: 'trial'
    }
    expect(isValidSubscriber(customer)).toEqual(true)
  })
  it('会员情况， status === active', () => {
    customer['subscription'] = {
      id: 3,
      status: 'active'
    }
    expect(isValidSubscriber(customer)).toEqual(true)
  })
  it('会员情况， status === pending_hold', () => {
    customer['subscription'] = {
      id: 3,
      status: 'pending_hold'
    }
    expect(isValidSubscriber(customer)).toEqual(true)
  })
  it('会员情况， status === on_hold', () => {
    customer['subscription'] = {
      id: 3,
      status: 'on_hold'
    }
    expect(isValidSubscriber(customer)).toEqual(true)
  })
})

describe('test customer isExpiredSubscriber', () => {
  let customer = {}
  it('非会员', () => {
    expect(isExpiredSubscriber(customer)).toEqual(false)
  })

  it('会员过期', () => {
    customer['subscription'] = {
      id: 3,
      status: ''
    }
    expect(isExpiredSubscriber(customer)).toEqual(true)
  })

  it('会员未过期, status === trial', () => {
    customer['subscription'] = {
      id: 3,
      status: 'trial'
    }
    expect(isExpiredSubscriber(customer)).toEqual(false)
  })

  it('会员未过期, status === active', () => {
    customer['subscription'] = {
      id: 3,
      status: 'active'
    }
    expect(isExpiredSubscriber(customer)).toEqual(false)
  })

  it('会员未过期, status === pending_hold', () => {
    customer['subscription'] = {
      id: 3,
      status: 'pending_hold'
    }
    expect(isExpiredSubscriber(customer)).toEqual(false)
  })

  it('会员未过期, status === on_hold', () => {
    customer['subscription'] = {
      id: 3,
      status: 'on_hold'
    }
    expect(isExpiredSubscriber(customer)).toEqual(false)
  })
})

describe('test customer expiresInDays', () => {
  let customer = {
    subscription: {
      id: 22,
      billing_date: addDays(new Date(), -4)
    }
  }
  it('过期天数4天', () => {
    expect(expiresInDays(customer)).toEqual(4)
  })

  it('在会员期内', () => {
    customer.subscription.billing_date = addDays(new Date(), 2)
    expect(expiresInDays(customer)).toEqual(-1)
  })
})

describe('test customer isVacation', () => {
  let customer = {
    subscription: {}
  }

  it('subscription为空，非度假套餐会员', () => {
    expect(isVacation(customer)).toEqual(false)
  })

  it('subscription_type为空，非度假套餐会员', () => {
    customer.subscription.id = 2
    expect(isVacation(customer)).toEqual(false)
  })

  it('subscription_type === ，非度假套餐会员', () => {
    customer.subscription.subscription_type = {
      occasion: 'beach_vacation'
    }
    expect(isVacation(customer)).toEqual(true)
  })
})

describe('test customer isSpecialUser', () => {
  let customer = {}

  it('非特殊会员', () => {
    expect(isSpecialUser(customer)).toEqual(false)
  })

  it('免费试用会员', () => {
    customer = {
      isFreeUser: true
    }
    expect(isSpecialUser(customer)).toEqual(true)
  })

  it('79试用会员', () => {
    customer = {
      isFreeTote79: true
    }
    expect(isSpecialUser(customer)).toEqual(true)
  })
})
