import {
	Card,
	CardFace,
	DraftEffectType,
	SimpleDraftEffectType,
	OnPickDraftEffect,
	OptionalOnPickDraftEffect,
	UniqueCard,
	UsableDraftEffect,
	DraftEffect,
	ParameterizedDraftEffectType,
	QualityKind,
	CardRarity,
	CardColor,
	QualityAtom,
} from "./CardTypes.js";
import {
	hasOptionalProperty,
	hasProperty,
	isArrayOf,
	isBoolean,
	isObject,
	isRecord,
	isString,
	isNumber,
	isUnion,
	isSomeEnum,
	isInteger,
} from "./TypeChecks.js";

export function isDraftEffectType(str: unknown): str is DraftEffectType {
	return isString(str) && (isSimpleDraftEffectType(str) || isParameterizedDraftEffectType(str));
}

export function isSimpleDraftEffectType(str: unknown): str is SimpleDraftEffectType {
	return (
		isString(str) &&
		(isSomeEnum(OnPickDraftEffect)(str) ||
			isSomeEnum(OptionalOnPickDraftEffect)(str) ||
			isSomeEnum(UsableDraftEffect)(str) ||
			[
				"TrackRemovedCardsNames",
				"TrackRemovedCardsSubtypes",
				"CogworkGrinder",
				"RemoveNotedCard",
				"NoteFaceUp",
			].includes(str))
	);
}

export function isParameterizedDraftEffectType(str: unknown): str is ParameterizedDraftEffectType {
	return isString(str) && isSomeEnum(ParameterizedDraftEffectType)(str);
}

export function isDraftEffect(obj: unknown): obj is DraftEffect {
	if (!isObject(obj)) return false;
	if (!hasProperty("type", isDraftEffectType)(obj)) return false;
	if (obj.type === ParameterizedDraftEffectType.AddCards)
		return hasProperty("count", isInteger)(obj) && hasProperty("cards", isArrayOf(isString))(obj);
	if (obj.type === ParameterizedDraftEffectType.CantPick)
		return hasProperty("pick", isInteger)(obj) || hasProperty("pick", isArrayOf(isInteger))(obj);
	if (obj.type === ParameterizedDraftEffectType.ReplaceNotedCard)
		return hasProperty("count", isInteger)(obj) && hasProperty("cards", isArrayOf(isString))(obj);
	if (obj.type === ParameterizedDraftEffectType.AddCardsOnReveal)
		return hasProperty("count", isInteger)(obj) && hasProperty("cards", isArrayOf(isString))(obj);
	if (obj.type === ParameterizedDraftEffectType.NoteQualityName)
		return hasProperty("qualities", isArrayOf(isArrayOf(isQualityAtom)))(obj);
	return hasProperty("type", isSimpleDraftEffectType)(obj);
}

export function isQualityAtom(obj: unknown): obj is QualityAtom {
	if (!isObject(obj)) return false;
	if (!hasProperty("kind", isSomeEnum(QualityKind))(obj)) return false;

	switch (obj.kind) {
		case QualityKind.Rarity:
			return hasProperty("value", isString)(obj);
		case QualityKind.Type:
			return hasProperty("value", isString)(obj);
		case QualityKind.Subtype:
			return hasProperty("value", isString)(obj);
		case QualityKind.Color:
			return hasProperty("value", isSomeEnum(CardColor))(obj);
		case QualityKind.Supertype:
			return hasProperty("value", isString)(obj);
		default:
			return false;
	}
}

export function isCardFace(obj: unknown): obj is CardFace {
	return (
		isObject(obj) &&
		hasProperty("name", isString)(obj) &&
		hasProperty("type", isString)(obj) &&
		hasProperty("subtypes", isArrayOf(isString))(obj) &&
		hasProperty("printed_names", isRecord(isString, isString))(obj) &&
		hasProperty("image_uris", isRecord(isString, isString))(obj)
	);
}

export function isCard(obj: unknown): obj is Card {
	return (
		isObject(obj) &&
		hasProperty("id", isString)(obj) &&
		hasOptionalProperty("arena_id", isNumber)(obj) &&
		hasProperty("oracle_id", isString)(obj) &&
		hasProperty("name", isString)(obj) &&
		hasProperty("mana_cost", isString)(obj) &&
		hasProperty("cmc", isNumber)(obj) &&
		hasProperty("colors", isArrayOf(isString))(obj) &&
		hasProperty("set", isString)(obj) &&
		hasProperty("collector_number", isString)(obj) &&
		hasProperty("rarity", isString)(obj) &&
		hasProperty("type", isString)(obj) &&
		hasProperty("subtypes", isArrayOf(isString))(obj) &&
		hasProperty("rating", isNumber)(obj) &&
		hasProperty("in_booster", isBoolean)(obj) &&
		hasOptionalProperty("layout", isString)(obj) &&
		hasProperty("printed_names", isRecord(isString, isString))(obj) &&
		hasProperty("image_uris", isRecord(isString, isString))(obj) &&
		hasOptionalProperty("back", isCardFace)(obj) &&
		hasOptionalProperty("is_custom", isBoolean)(obj) &&
		hasOptionalProperty("related_cards", isArrayOf(isUnion(isString, isCardFace)))(obj) &&
		hasOptionalProperty("draft_effects", isArrayOf(isDraftEffect))(obj) &&
		hasOptionalProperty("oracle_text", isString)(obj) &&
		hasOptionalProperty("power", isUnion(isNumber, isString))(obj) &&
		hasOptionalProperty("toughness", isUnion(isNumber, isString))(obj) &&
		hasOptionalProperty("loyalty", isUnion(isNumber, isString))(obj)
	);
}

export function isUniqueCard(obj: unknown): obj is UniqueCard {
	return isCard(obj) && hasProperty("uniqueID", isNumber)(obj);
}
