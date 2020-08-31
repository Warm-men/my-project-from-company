import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import dateFns from 'date-fns'
export default class BonusItem extends PureComponent {
  render() {
    const {
      transaction_type,
      income,
      created_at,
      amount
    } = this.props.transactionItem
    const createdAt = dateFns.format(created_at, 'YYYY-MM-DD  HH:mm')
    return (
      <View style={styles.referralView}>
        <View>
          <Text style={styles.transactionType}>{transaction_type}</Text>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
        <View>
          <Text style={income ? styles.income : styles.spent}>
            {income ? '+' : '-'}
            {amount}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  referralView: {
    paddingHorizontal: 30,
    height: 72,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transactionType: {
    fontSize: 15,
    color: '#333',
    marginBottom: 9
  },
  createdAt: {
    fontSize: 12,
    color: '#999'
  },
  income: {
    fontSize: 16,
    color: '#E85C40',
    fontWeight: '600'
  },
  spent: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '600'
  }
})
