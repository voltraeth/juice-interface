import { t, Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'

import { IssueTokenTxArgs } from '../IssueTokenButton'
import TransactionModal from '../TransactionModal'

export default function IssueTokenModal({
  visible,
  onClose,
  useIssueTokensTx,
  isNewDeploy,
  onConfirmed,
}: {
  visible: boolean
  onClose: VoidFunction
  useIssueTokensTx: () => TransactorInstance<IssueTokenTxArgs>
  isNewDeploy?: boolean
  onConfirmed?: VoidFunction
}) {
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<IssueTokenTxArgs>()

  const issueTokensTx = useIssueTokensTx()

  async function executeIssueTokensTx() {
    await form.validateFields()

    setLoading(true)

    const fields = form.getFieldsValue(true)

    const txSuccess = await issueTokensTx(
      { name: fields.name, symbol: fields.symbol },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          onClose()
          onConfirmed?.()
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  return (
    <TransactionModal
      visible={visible}
      title={t`Issue ERC-20 token`}
      okText={t`Issue token`}
      cancelText={t`Later`}
      connectWalletText={t`Connect wallet to issue`}
      onOk={executeIssueTokensTx}
      onCancel={() => onClose()}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <p>
        {!isNewDeploy ? (
          <Trans>
            Issue an ERC-20 to be used as this project's token. Once issued,
            anyone can claim their existing token balance in the new token.
          </Trans>
        ) : (
          <Trans>
            Would you like to issue an ERC-20 token to be used as this project's
            token?
          </Trans>
        )}
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t`Token name`}
          rules={[{ required: true, message: t`Token name is required` }]}
        >
          <Input placeholder={t`Project Token`} />
        </Form.Item>
        <Form.Item
          name="symbol"
          label={t`Token symbol`}
          rules={[{ required: true, message: t`Token symbol is required` }]}
        >
          <Input
            placeholder="PRJ"
            onChange={e =>
              form.setFieldsValue({ symbol: e.target.value.toUpperCase() })
            }
          />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
