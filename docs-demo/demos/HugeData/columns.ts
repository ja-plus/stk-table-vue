import { StkTableColumn } from '@/StkTable';
import { h } from 'vue';
import ExpandCell from './custom-cells/ExpandCell.vue';
import SourceCell from './custom-cells/SourceCell.vue';
import { DataType } from './types';

export const columns: StkTableColumn<DataType>[] = [
    { type: 'seq', dataIndex: '' as any, title: '序号', fixed: 'left', width: 70 },
    {
        dataIndex: 'source',
        title: '经纪商',
        width: 80,
        sortField: 'source',
        align: 'center',
        fixed: 'left',
        customCell: props => {
            if (props.row._isChildren) {
                return h(SourceCell, {
                    ...props,
                });
            }
            return h(ExpandCell, {
                ...props,
            });
        },
    },
    { dataIndex: 'code', title: '债券代码', sortField: 'thsCode', fixed: 'left', headerAlign: 'left' },
    { dataIndex: 'bondAbbreviation', title: '债券简称', fixed: 'left', width: 150, headerAlign: 'left' },
    { dataIndex: 'remainingPeriod', title: '剩余期限' },
    { dataIndex: 'bestBuyVol', sortType: 'number', title: '买量', align: 'right', headerAlign: 'right', sorter: true },
    {
        dataIndex: 'bestBuyPrice',
        title: 'Bid',
        className: 'red-cell',
        align: 'right',
        headerAlign: 'right',
        sorter: true,
        sortType: 'number',
    },
    {
        dataIndex: 'bestSellPrice',
        title: 'Ofr',
        className: 'green-cell',
        align: 'right',
        headerAlign: 'right',
        sorter: true,
        sortType: 'number',
    },
    { dataIndex: 'bestSellVol', sortType: 'number', title: '卖量', align: 'right', headerAlign: 'right', sorter: true },
    { dataIndex: 'lastPrice', title: '成交', className: 'blue-cell', align: 'right', headerAlign: 'right', sortType: 'number', sorter: true },
    { dataIndex: 'couponRate', sortType: 'number', title: '票面利率(%)', align: 'right', headerAlign: 'right' },
    { dataIndex: 'orgDebtRating', title: '主/债评级' },
    { dataIndex: 'cbImpliedRating', title: '隐含评级(中债)', width: 120 },
    { dataIndex: 'csiImpliedRating', title: '隐含评级(中证)', width: 120 },
    { dataIndex: 'outlook', title: '展望', sortField: 'outlook' },
    { dataIndex: 'entitlementType', title: '含权类型' },
    { dataIndex: 'nextExerciseDate', title: '下一行权日' },
    { dataIndex: 'expiryDate', title: '到期日' },
    { dataIndex: 'issueWay', title: '发行方式' },
    { dataIndex: 'crossMarket', title: '跨市场' },
    { dataIndex: 'industry', title: '所属行业' },
    { dataIndex: 'ratingOrg', title: '评级机构' },
    { dataIndex: 'bondType', title: '债券类型' },
    { dataIndex: 'orgName', title: '发行人', sortField: 'orgName' },
    { dataIndex: 'bestTime', title: '时间', sortField: 'bestTime' },
    { dataIndex: 'bestBidNetPrice', sortType: 'number', title: 'Bid参考净价', align: 'right', headerAlign: 'right' },
    { dataIndex: 'bestOfrNetPrice', sortType: 'number', title: 'Ofr参考净价', align: 'right', headerAlign: 'right' },
    { dataIndex: 'bestBidClearingSpeed', title: 'Bid清算速度' },
    { dataIndex: 'bestOfrClearingSpeed', title: 'Ofr清算速度' },
    { dataIndex: 'cbValue', sortType: 'number', title: '中债估值', sortField: 'cbValuation', align: 'right', headerAlign: 'right' },
    { dataIndex: 'lastDealCbBp', sortType: 'number', title: '成交-中债(BP)', align: 'right', headerAlign: 'right', width: 120 },
    { dataIndex: 'cbNetPriceStr', sortType: 'number', title: '净价(中债)', align: 'right', headerAlign: 'right' },
    { dataIndex: 'cbDurationStr', sortType: 'number', title: '久期(中债)', sortField: 'cbDuration', align: 'right', headerAlign: 'right' },
    { dataIndex: 'csiValue', sortType: 'number', title: '中证估值', sortField: 'csiValuation', align: 'right', headerAlign: 'right' },
    { dataIndex: 'lastDealCsiBp', sortType: 'number', title: '成交-中证(BP)', align: 'right', headerAlign: 'right', width: 120 },
    { dataIndex: 'csiNetPriceStr', sortType: 'number', title: '净价(中证)', sortField: 'csiNetPrice', align: 'right', headerAlign: 'right' },
    { dataIndex: 'csiCbStr', sortType: 'number', title: '中证-中债', sortField: 'csiCbBp', align: 'right', headerAlign: 'right' },
    { dataIndex: 'bestBidCbBp', sortType: 'number', title: 'Bid-中债(BP)', align: 'right', headerAlign: 'right', width: 120 },
    { dataIndex: 'bestCbOfrBp', sortType: 'number', title: '中债-Ofr(BP)', align: 'right', headerAlign: 'right', width: 120 },
    { dataIndex: 'bestBidCsiBp', sortType: 'number', title: 'Bid-中证(BP)', align: 'right', headerAlign: 'right', width: 120 },
    { dataIndex: 'bestCsiOfrBp', sortType: 'number', title: '中证-Ofr(BP)', align: 'right', headerAlign: 'right', width: 120 },
];
