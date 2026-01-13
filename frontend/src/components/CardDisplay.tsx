import { SimpleCard as CardType, CardStats } from "../types/game";
import {
  CARD_CLASSES,
  CARD_ELEMENTS,
  CARD_RARITIES,
  RARITY_COLORS,
  CLASS_DESCRIPTIONS
} from "../utils/constants";

interface CardDisplayProps {
  card: CardType;
  stats?: CardStats;
  showDetails?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (cardId: bigint) => void;
  compact?: boolean;
}

export function CardDisplay({
  card,
  stats,
  showDetails = false,
  selectable = false,
  isSelected = false,
  onSelect,
  compact = false
}: CardDisplayProps) {
  const classStr = CARD_CLASSES[card.class as keyof typeof CARD_CLASSES];
  const elementStr = CARD_ELEMENTS[card.element as keyof typeof CARD_ELEMENTS];
  const rarityStr = CARD_RARITIES[card.rarity as keyof typeof CARD_RARITIES];
  const rarityColor = RARITY_COLORS[rarityStr];

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(card.id);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected
            ? "bg-green-600 border-green-400"
            : "bg-gray-800 border-gray-600 hover:border-gray-400"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-white truncate">{card.name}</p>
            <p className="text-xs text-gray-300">
              {classStr} • {elementStr}
            </p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded text-black bg-${rarityColor}-400`}>
            {rarityStr}
          </span>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-300">
          <span>Lvl {Number(card.level)}</span>
          <span>{Number(card.wins)}W-{Number(card.losses)}L</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? "bg-gradient-to-b from-green-700 to-green-900 border-green-300"
          : "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600"
      } ${selectable ? "cursor-pointer hover:border-gray-400" : ""}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{card.name}</h3>
          <p className="text-sm text-gray-300">
            {classStr} of {elementStr}
          </p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded bg-${rarityColor}-500 text-white`}>
          {rarityStr}
        </span>
      </div>

      {/* Level & Record */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">LEVEL</p>
          <p className="text-lg font-bold text-white">{Number(card.level)}</p>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">WINS</p>
          <p className="text-lg font-bold text-green-400">{Number(card.wins)}</p>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <p className="text-xs text-gray-400">LOSSES</p>
          <p className="text-lg font-bold text-red-400">{Number(card.losses)}</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-3 bg-gray-700 rounded p-3">
          <p className="text-xs font-bold text-gray-300 mb-2">STATS</p>
          <div className="grid grid-cols-4 gap-2">
            <StatBar label="ATK" value={stats.attack} maxValue={30} color="red" />
            <StatBar label="DEF" value={stats.defense} maxValue={30} color="blue" />
            <StatBar label="SPD" value={stats.speed} maxValue={30} color="yellow" />
            <StatBar label="HP" value={stats.hp} maxValue={30} color="green" />
          </div>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="bg-gray-700 rounded p-3 mb-3">
          <p className="text-xs font-bold text-gray-300 mb-2">CLASS PASSIVE</p>
          <p className="text-xs text-gray-200">
            {CLASS_DESCRIPTIONS[classStr as keyof typeof CLASS_DESCRIPTIONS]?.passive ||
              "No description"}
          </p>
        </div>
      )}

      {/* Select indicator */}
      {selectable && isSelected && (
        <div className="mt-3 text-center text-green-400 font-bold">✓ SELECTED</div>
      )}
    </div>
  );
}

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: "red" | "blue" | "yellow" | "green";
}

function StatBar({ label, value, maxValue, color }: StatBarProps) {
  const percent = Math.min((value / maxValue) * 100, 100);
  const colorClass = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    yellow: "bg-yellow-600",
    green: "bg-green-600"
  }[color];

  return (
    <div>
      <p className="text-xs font-bold text-gray-300">{label}</p>
      <div className="w-full bg-gray-900 rounded h-2 overflow-hidden">
        <div className={`${colorClass} h-full`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">{value}</p>
    </div>
  );
}
