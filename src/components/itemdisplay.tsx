import React, { PureComponent } from 'react';

import CONFIG from './CONFIG';
import { MergedData } from '../context/mergedcontext';
import { CompletionState, PlayerCrew, PlayerData, PlayerEquipmentItem } from '../model/player';
import { CrewTarget } from './hovering/crewhoverstat';
import { CrewMember } from '../model/crew';
import { VoyageContext } from './voyagecalculator';
import { EquipmentCommon, EquipmentItem } from '../model/equipment';
import { ItemTarget } from './hovering/itemhoverstat';
import { mergeItems } from '../utils/itemutils';

type ItemDisplayProps = {
	maxRarity: number;
	rarity: number;
	hideRarity?: boolean;
	size: number;
	style?: any;
	src: string;
	itemSymbol?: string;
	targetGroup?: string;
	playerData?: PlayerData;
	allCrew?: CrewMember[];
	allItems?: EquipmentCommon[];		
};

class ItemDisplay extends PureComponent<ItemDisplayProps> {
	render() {
		const { playerData, allCrew, allItems, targetGroup, itemSymbol } = this.props;

		let borderWidth = Math.ceil(this.props.size / 34);
		let starSize = Math.floor(this.props.size / 6);
		let bottomStar = Math.floor(this.props.size / 23);
		let borderRadius = Math.floor(this.props.size / 7);
		let borderColor = CONFIG.RARITIES[this.props.maxRarity ?? 0].color;

		let star_reward = `${process.env.GATSBY_ASSETS_URL}atlas/star_reward.png`;
		let star_reward_inactive = `${process.env.GATSBY_ASSETS_URL}atlas/star_reward_inactive.png`;

		let rarity = [] as JSX.Element[];
		if (!this.props.hideRarity) {
			for (let i = 0; i < this.props.rarity; i++) {
				rarity.push(<img key={i} src={star_reward} style={{ width: starSize + 'px' }} />);
			}
			for (let i = this.props.rarity; i < this.props.maxRarity; i++) {
				rarity.push(<img key={i} src={star_reward_inactive} style={{ width: starSize + 'px' }} />);
			}
		}

		const divStyle = { 
			... (this.props.style ?? {}), 
			position: 'relative',
			display: 'flex',
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			width: this.props.size + 'px',
			height: this.props.size + 'px',
		};

		const imgStyle = {
			borderStyle: 'solid',
			borderRadius: borderRadius + 'px',
			borderWidth: borderWidth + 'px',
			borderColor: borderColor,
			width: this.props.size - 2 * borderWidth + 'px',
			height: this.props.size - 2 * borderWidth + 'px'
		} as React.CSSProperties;

		const starStyle = {
			position: 'absolute',
			width: this.props.size + 'px',
			bottom: bottomStar + 'px',
			left: '50%',
			transform: 'translate(-50%, 0)',
			textAlign: 'center'									
		} as React.CSSProperties;

		let crew: PlayerCrew | undefined = undefined;
		let item: EquipmentItem | undefined = undefined;

		if (allCrew && itemSymbol && targetGroup) {
			crew = playerData?.player?.character?.crew?.find(crew => crew.symbol === itemSymbol);
			if (!crew) {
				crew = allCrew.find(crew => crew.symbol === itemSymbol) as PlayerCrew | undefined;
				if (crew) crew.immortal = CompletionState.DisplayAsImmortalUnowned;
			}
		}

		if (allItems && itemSymbol && targetGroup) {
			let pitem = playerData?.player?.character?.items?.find(item => item.symbol === itemSymbol) as PlayerEquipmentItem | undefined;
			let citem = allItems.find(crew => crew.symbol === itemSymbol) as EquipmentItem | undefined;				
			if (pitem && citem) {
				item = mergeItems([pitem], [citem])[0] as EquipmentItem;
			}
			else if (citem){
				item = citem as EquipmentItem;
			}
			else if (pitem) {
				item = pitem as EquipmentItem;
			}
			if (item && citem) {
				item.demandCrew = citem.demandCrew;
			}
		}

		if (crew && itemSymbol && allCrew && targetGroup) {
			return (						
					<div style={divStyle}>
						<CrewTarget 
							inputItem={crew} 
							targetGroup={targetGroup} 
							>
							<img
								src={this.props.src}
								style={imgStyle}
							/>
						</CrewTarget>
						{!this.props.hideRarity && (
							<div
								style={starStyle}>
								{rarity}
							</div>
						)}
					</div>
			);
		}
		else if (item && itemSymbol && allItems && targetGroup) {
			return (						
					<div style={divStyle}>
						<ItemTarget														
							inputItem={item} 
							targetGroup={targetGroup} 
							>
							<img
								src={this.props.src}
								style={imgStyle}
							/>
						</ItemTarget>
						{!this.props.hideRarity && (
							<div
								style={starStyle}>
								{rarity}
							</div>
						)}
					</div>
			);
		}		
		else {
			return (
				<div style={divStyle}>
					<img
						src={this.props.src}
						style={imgStyle}
					/>
					{!this.props.hideRarity && (
						<div
							style={starStyle}>
							{rarity}
						</div>
					)}
				</div>
			);
		}
	}
}

export default ItemDisplay;
