import { Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import useMobile from 'hooks/Mobile'
import { useAppSelector } from 'hooks/AppSelector'

import DeployProjectButton from './DeployProjectButton'
import ProjectDetailsSection from './ProjectDetailsSection'
import FundingSummarySection from './FundingSummarySection'
import NftSummarySection from './NftSummarySection'
import { StartOverButton } from '../../StartOverButton'
import { DeployProjectWithNftsButton } from './DeployProjectWithNftsButton'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)
  const hasNfts = Boolean(nftRewardTiers?.length)

  const isMobile = useMobile()
  return (
    <div style={isMobile ? { padding: '0 1rem' } : {}}>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <Space size="large" direction="vertical" style={{ width: '100%' }}>
          <ProjectDetailsSection />
          <FundingSummarySection />
          {hasNfts ? <NftSummarySection /> : null}
        </Space>
      </div>
      {hasNfts ? <DeployProjectWithNftsButton /> : <DeployProjectButton />}
      <StartOverButton />
    </div>
  )
}
