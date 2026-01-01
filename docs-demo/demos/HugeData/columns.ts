import { StkTableColumn } from '@/StkTable';
import { useFilter } from '../../../src/StkTable/index';
import { h } from 'vue';
import ExpandCell from './custom-cells/ExpandCell.vue';
import SourceCell from './custom-cells/SourceCell.vue';
import { DataType } from './types';
import { useI18n } from '../../hooks/useI18n/index';

const { Filter } = useFilter();
export const columns: () => StkTableColumn<DataType>[] = () => {
    const { t } = useI18n();
    return [
        { type: 'seq', dataIndex: '' as any, title: t('seq'), fixed: 'left', width: 70 },
        {
            dataIndex: 'source',
            title: t('source'),
            width: 70,
            sortField: 'source',
            align: 'center',
            fixed: 'left',
            customCell: props => {
                if (props.row._isChildren) {
                    return h(SourceCell, props);
                }
                return h(ExpandCell, props);
            },
        },
        {
            dataIndex: 'code',
            title: t('code'),
            sortField: 'thsCode',
        },
        {
            dataIndex: 'bondAbbreviation',
            title: t('name'),
            width: 150,
        },
        { dataIndex: 'remainingPeriod', title: t('remainingPeriod') },
        {
            dataIndex: 'bestBuyVol',
            sortType: 'number',
            title: t('buyVolume'),
            align: 'right',
            headerAlign: 'right',
            sorter: true,
            customHeaderCell: Filter({
                options: [
                    { label: '1000000', value: 1000000 },
                    { label: '500000', value: 500000 },
                    { label: '2000', value: 2000 },
                ]
            }),
        },
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
        {
            dataIndex: 'bestSellVol',
            sortType: 'number',
            title: t('sellVolume'),
            align: 'right',
            headerAlign: 'right',
            sorter: true,
        },
        {
            dataIndex: 'lastPrice',
            title: t('transaction'),
            className: 'blue-cell',
            align: 'right',
            headerAlign: 'right',
            sortType: 'number',
            sorter: true,
        },
        {
            dataIndex: 'couponRate',
            sortType: 'number',
            title: t('couponRate'),
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'bestTime',
            title: t('time'),
            sortField: 'bestTime',
            align: 'center',
            sorter: true,
            width: 150,
        },
        { dataIndex: 'orgDebtRating', title: t('mainDebtRating') },
        { dataIndex: 'cbImpliedRating', title: t('impliedRatingCnBond'), width: 120 },
        { dataIndex: 'csiImpliedRating', title: t('impliedRatingCsi'), width: 120 },
        { dataIndex: 'outlook', title: t('outlook'), sortField: 'outlook' },
        { dataIndex: 'entitlementType', title: t('entitlementType') },
        { dataIndex: 'nextExerciseDate', title: t('nextExerciseDate') },
        { dataIndex: 'expiryDate', title: t('expiryDate') },
        { dataIndex: 'issueWay', title: t('issueWay') },
        { dataIndex: 'crossMarket', title: t('crossMarket') },
        { dataIndex: 'industry', title: t('industry') },
        { dataIndex: 'ratingOrg', title: t('ratingOrg') },
        { dataIndex: 'bondType', title: t('bondType') },
        { dataIndex: 'orgName', title: t('issuer'), sortField: 'orgName' },
        {
            dataIndex: 'bestBidNetPrice',
            sortType: 'number',
            title: t('bidReferenceNetPrice'),
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'bestOfrNetPrice',
            sortType: 'number',
            title: t('ofrReferenceNetPrice'),
            align: 'right',
            headerAlign: 'right',
        },
        { dataIndex: 'bestBidClearingSpeed', title: t('bidClearingSpeed') },
        { dataIndex: 'bestOfrClearingSpeed', title: t('ofrClearingSpeed') },
        {
            dataIndex: 'cbValue',
            sortType: 'number',
            title: t('cnBondValuation'),
            sortField: 'cbValuation',
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'lastDealCbBp',
            sortType: 'number',
            title: t('transactionCnBondBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
        {
            dataIndex: 'cbNetPriceStr',
            sortType: 'number',
            title: t('netPriceCnBond'),
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'cbDurationStr',
            sortType: 'number',
            title: t('durationCnBond'),
            sortField: 'cbDuration',
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'csiValue',
            sortType: 'number',
            title: t('csiValuation'),
            sortField: 'csiValuation',
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'lastDealCsiBp',
            sortType: 'number',
            title: t('transactionCsiBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
        {
            dataIndex: 'csiNetPriceStr',
            sortType: 'number',
            title: t('netPriceCsi'),
            sortField: 'csiNetPrice',
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'csiCbStr',
            sortType: 'number',
            title: t('csiCnBond'),
            sortField: 'csiCbBp',
            align: 'right',
            headerAlign: 'right',
        },
        {
            dataIndex: 'bestBidCbBp',
            sortType: 'number',
            title: t('bidCnBondBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
        {
            dataIndex: 'bestCbOfrBp',
            sortType: 'number',
            title: t('cnBondOfrBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
        {
            dataIndex: 'bestBidCsiBp',
            sortType: 'number',
            title: t('bidCsiBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
        {
            dataIndex: 'bestCsiOfrBp',
            sortType: 'number',
            title: t('csiOfrBp'),
            align: 'right',
            headerAlign: 'right',
            width: 120,
        },
    ];
};
