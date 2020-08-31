import React from 'react'
import Address from '../express_information_address'
import render from 'react-test-renderer'

describe('express_information page', () => {
  describe('test render', () => {
    it('express_information', () => {
      const tree = render
        .create(
          <Address
            address={{
              address_1: '123',
              address_2: '321',
              city: '北京市',
              company: null,
              country: 'CN',
              customer_id: 665640,
              district: '东城区',
              full_name: '何兆',
              id: 21,
              state: '北京',
              telephone: '15555555555',
              zip_code: '100011'
            }}
          />
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
