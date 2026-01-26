import React from 'react';
import {View} from 'react-native';
import Avatar from '@components/Avatar';
import Checkbox from '@components/Checkbox';
import type {SearchColumnType} from '@components/Search/types';
import type {ListItem, TransactionTagGroupListItemType} from '@components/SelectionListWithSections/types';
import TextWithTooltip from '@components/TextWithTooltip';
import UserDetailsTooltip from '@components/UserDetailsTooltip';
import useLocalize from '@hooks/useLocalize';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useStyleUtils from '@hooks/useStyleUtils';
import useThemeStyles from '@hooks/useThemeStyles';
import {getDisplayNameOrDefault} from '@libs/PersonalDetailsUtils';
import CONST from '@src/CONST';
import ExpandCollapseArrowButton from './ExpandCollapseArrowButton';
import TextCell from './TextCell';
import TotalCell from './TotalCell';

type MemberListItemHeaderProps<TItem extends ListItem> = {
    /** The tag currently being looked at */
    tag: TransactionTagGroupListItemType;

    /** Callback to fire when a checkbox is pressed */
    onCheckboxPress?: (item: TItem) => void;

    /** Whether this section items disabled for selection */
    isDisabled?: boolean | null;

    /** Whether selecting multiple transactions at once is allowed */
    canSelectMultiple: boolean | undefined;

    /** Whether all transactions are selected */
    isSelectAllChecked?: boolean;

    /** Whether only some transactions are selected */
    isIndeterminate?: boolean;

    /** Callback for when the down arrow is clicked */
    onDownArrowClick?: () => void;

    /** Whether the down arrow is expanded */
    isExpanded?: boolean;

    /** The visible columns for the header */
    columns?: SearchColumnType[];
};

function MemberListItemHeader<TItem extends ListItem>({
    tag: tagItem,
    onCheckboxPress,
    isDisabled,
    canSelectMultiple,
    isSelectAllChecked,
    isIndeterminate,
    isExpanded,
    onDownArrowClick,
    columns,
}: MemberListItemHeaderProps<TItem>) {
    const styles = useThemeStyles();
    const StyleUtils = useStyleUtils();
    const {isLargeScreenWidth} = useResponsiveLayout();
    const {translate, formatPhoneNumber} = useLocalize();
    const formattedDisplayName = formatPhoneNumber(getDisplayNameOrDefault(tagItem));
    const formattedLogin = formatPhoneNumber(tagItem.login ?? '');

    console.log(tagItem);

    console.log('Hi');

    const columnComponents = {
        [CONST.SEARCH.TABLE_COLUMNS.GROUP_TAG]: (
            <View
                key={CONST.SEARCH.TABLE_COLUMNS.GROUP_TAG}
                style={StyleUtils.getReportTableColumnStyles(CONST.SEARCH.TABLE_COLUMNS.TAG)}
            >
                <View style={[styles.gap1, styles.flexShrink1]}>
                    <TextWithTooltip
                        text={tagItem.formattedTag ?? ''}
                        style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre, styles.fontWeightNormal]}
                    />
                </View>
            </View>
        ),
        [CONST.SEARCH.TABLE_COLUMNS.GROUP_EXPENSES]: (
            <View
                key={CONST.SEARCH.TABLE_COLUMNS.GROUP_EXPENSES}
                style={StyleUtils.getReportTableColumnStyles(CONST.SEARCH.TABLE_COLUMNS.EXPENSES)}
            >
                <TextCell text={String(tagItem.count)} />
            </View>
        ),
        [CONST.SEARCH.TABLE_COLUMNS.GROUP_TOTAL]: (
            <View
                key={CONST.SEARCH.TABLE_COLUMNS.GROUP_TOTAL}
                style={StyleUtils.getReportTableColumnStyles(CONST.SEARCH.TABLE_COLUMNS.TOTAL, false, false, false, false, false, false, false, true)}
            >
                <TotalCell
                    total={tagItem.total}
                    currency={tagItem.currency}
                />
            </View>
        ),
    };

    return (
        <View>
            <View style={[styles.pv1Half, styles.pl3, styles.flexRow, styles.alignItemsCenter, isLargeScreenWidth ? styles.gap3 : styles.justifyContentStart]}>
                <View style={[styles.flexRow, styles.alignItemsCenter, styles.mnh40, styles.flex1, styles.gap3]}>
                    {!!canSelectMultiple && (
                        <Checkbox
                            onPress={() => onCheckboxPress?.(tagItem as unknown as TItem)}
                            isChecked={isSelectAllChecked}
                            isIndeterminate={isIndeterminate}
                            disabled={!!isDisabled || tagItem.isDisabledCheckbox}
                            accessibilityLabel={translate('common.select')}
                            style={isLargeScreenWidth && styles.mr1}
                        />
                    )}
                    {!isLargeScreenWidth && (
                        <View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                            <UserDetailsTooltip accountID={tagItem.accountID}>
                                <View>
                                    <Avatar
                                        source={tagItem.avatar}
                                        type={CONST.ICON_TYPE_AVATAR}
                                        name={formattedDisplayName}
                                        avatarID={tagItem.accountID}
                                    />
                                </View>
                            </UserDetailsTooltip>
                            <View style={[styles.gap1, styles.flexShrink1]}>
                                <TextWithTooltip
                                    text={formattedDisplayName}
                                    style={[styles.optionDisplayName, styles.sidebarLinkTextBold, styles.pre, styles.fontWeightNormal]}
                                />
                                <TextWithTooltip
                                    text={formattedLogin || formattedDisplayName}
                                    style={[styles.textLabelSupporting, styles.lh16, styles.pre]}
                                />
                            </View>
                        </View>
                    )}
                    {isLargeScreenWidth && (
                        <>
                            <View style={StyleUtils.getReportTableColumnStyles(CONST.SEARCH.TABLE_COLUMNS.AVATAR)}>
                                <UserDetailsTooltip accountID={tagItem.accountID}>
                                    <View>
                                        <Avatar
                                            source={tagItem.avatar}
                                            type={CONST.ICON_TYPE_AVATAR}
                                            name={formattedDisplayName}
                                            avatarID={tagItem.accountID}
                                        />
                                    </View>
                                </UserDetailsTooltip>
                            </View>

                            {columns?.map((column) => columnComponents[column as keyof typeof columnComponents])}
                        </>
                    )}
                </View>
                {!isLargeScreenWidth && (
                    <View style={[[styles.flexShrink0, styles.mr3, styles.gap1]]}>
                        <TotalCell
                            total={tagItem.total}
                            currency={tagItem.currency}
                        />
                        {!!onDownArrowClick && (
                            <ExpandCollapseArrowButton
                                isExpanded={isExpanded}
                                onPress={onDownArrowClick}
                            />
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

export default MemberListItemHeader;
