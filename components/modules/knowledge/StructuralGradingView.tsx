import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, space, typeScale } from "../../../constants/appTheme";
import {
  FPRDI_GROUP_SCALE,
  FprdiGroupId,
  GradingProperty,
  ResearchBlock,
  SpeciesGrading,
  STRUCTURAL_GRADING,
  SUITABILITY_CATEGORIES,
  SuitabilityStatus,
} from "../../../constants/structuralGrading";
import { SUPPORTED_SPECIES } from "../../../constants/supportedSpecies";
import { useAppTheme } from "../../../hooks/useAppTheme";

type FilterKey = "all" | FprdiGroupId | "insufficient";

const GROUP_ORDER: FprdiGroupId[] = ["I", "II", "III", "IV", "V"];

const STATUS_LABEL: Record<SuitabilityStatus, string> = {
  D: "Documented",
  V: "Verify",
  N: "Outside documented",
  I: "Insufficient data",
};

const formatValue = (value: number | null) =>
  value === null ? "—" : value.toFixed(2);

export function StructuralGradingView() {
  const theme = useAppTheme();
  const [filter, setFilter] = useState<FilterKey>("all");

  const entries = useMemo(
    () =>
      SUPPORTED_SPECIES.map((species) => ({
        species,
        grading:
          STRUCTURAL_GRADING[species.id as keyof typeof STRUCTURAL_GRADING],
      })),
    [],
  );

  const filterOptions = useMemo(() => {
    const keys = new Set<FilterKey>();
    entries.forEach(({ grading }) =>
      keys.add(grading.grade ? grading.grade.group : "insufficient"),
    );
    const ordered: FilterKey[] = [
      ...GROUP_ORDER.filter((group) => keys.has(group)),
      ...(keys.has("insufficient") ? (["insufficient"] as FilterKey[]) : []),
    ];
    return ordered.map((key) => ({
      key,
      label: key === "insufficient" ? "Insufficient data" : `Group ${key}`,
      count: entries.filter(
        ({ grading }) =>
          (grading.grade ? grading.grade.group : "insufficient") === key,
      ).length,
    }));
  }, [entries]);

  const visible = entries.filter(({ grading }) => {
    if (filter === "all") return true;
    const key = grading.grade ? grading.grade.group : "insufficient";
    return key === filter;
  });

  const statusColors = (status: SuitabilityStatus) => {
    switch (status) {
      case "D":
        return { bg: theme.colors.primarySoft, fg: theme.colors.success };
      case "V":
        return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
      case "N":
        return { bg: theme.colors.surfaceMuted, fg: theme.colors.danger };
      default:
        return { bg: theme.colors.surfaceMuted, fg: theme.colors.textMuted };
    }
  };

  const renderPropertyTable = (title: string, rows: GradingProperty[]) => (
    <View style={styles.block}>
      <Text style={[styles.blockTitle, { color: theme.colors.textMuted }]}>
        {title}
      </Text>
      <View style={[styles.table, { borderColor: theme.colors.border }]}>
        <View
          style={[
            styles.tableRow,
            styles.tableHead,
            { backgroundColor: theme.colors.surfaceMuted },
          ]}
        >
          <Text
            style={[
              styles.cellLabel,
              styles.headText,
              { color: theme.colors.textMuted },
            ]}
          >
            PROPERTY
          </Text>
          <Text
            style={[
              styles.cellValue,
              styles.headText,
              { color: theme.colors.textMuted },
            ]}
          >
            GREEN
          </Text>
          <Text
            style={[
              styles.cellValue,
              styles.headText,
              { color: theme.colors.textMuted },
            ]}
          >
            12% MC
          </Text>
        </View>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.tableRow,
              index > 0 && {
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.cellLabel, { color: theme.colors.text }]}>
              {row.label}
              {row.unit ? (
                <Text
                  style={{ color: theme.colors.textMuted }}
                >{` (${row.unit})`}</Text>
              ) : null}
            </Text>
            <Text
              style={[
                styles.cellValue,
                {
                  color:
                    row.green === null
                      ? theme.colors.textMuted
                      : theme.colors.text,
                  fontWeight: row.green === null ? "600" : "800",
                },
              ]}
            >
              {formatValue(row.green)}
            </Text>
            <Text
              style={[
                styles.cellValue,
                {
                  color:
                    row.mc12 === null
                      ? theme.colors.textMuted
                      : theme.colors.text,
                  fontWeight: row.mc12 === null ? "600" : "800",
                },
              ]}
            >
              {formatValue(row.mc12)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderResearch = (block: ResearchBlock) => (
    <View key={block.title} style={styles.block}>
      <Text style={[styles.blockTitle, { color: theme.colors.textMuted }]}>
        {block.title.toUpperCase()}
      </Text>
      <Text style={[styles.source, { color: theme.colors.textMuted }]}>
        {block.source}
      </Text>
      {block.entries.map((entry) => (
        <View
          key={entry.heading}
          style={[
            styles.researchEntry,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.researchHeading, { color: theme.colors.text }]}>
            {entry.heading}
          </Text>
          <View style={styles.valueGrid}>
            {entry.values.map((item) => (
              <View key={item.label} style={styles.valueItem}>
                <Text
                  style={[styles.valueLabel, { color: theme.colors.textMuted }]}
                >
                  {item.label}
                </Text>
                <Text style={[styles.valueText, { color: theme.colors.text }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
          {entry.note ? (
            <Text
              style={[styles.researchNote, { color: theme.colors.textMuted }]}
            >
              {entry.note}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const renderSuitability = (grading: SpeciesGrading) => (
    <View style={styles.block}>
      <Text style={[styles.blockTitle, { color: theme.colors.textMuted }]}>
        DOCUMENTED END-USES
      </Text>
      {grading.suitability ? (
        <View style={styles.statusList}>
          {SUITABILITY_CATEGORIES.map((category) => {
            const status = grading.suitability
              ? grading.suitability[category]
              : "I";
            const colors = statusColors(status);
            return (
              <View key={category} style={styles.statusRow}>
                <Text
                  style={[styles.statusCategory, { color: theme.colors.text }]}
                >
                  {category}
                </Text>
                <View
                  style={[styles.statusPill, { backgroundColor: colors.bg }]}
                >
                  <Text style={[styles.statusText, { color: colors.fg }]}>
                    {STATUS_LABEL[status]}
                  </Text>
                </View>
              </View>
            );
          })}
          <Text
            style={[styles.researchNote, { color: theme.colors.textMuted }]}
          >
            Based on the end-uses FPRDI lists for Group {grading.grade?.group}.
            “Outside documented” means not documented for the group, not proof
            of failure.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.insufficient,
            { backgroundColor: theme.colors.surfaceMuted },
          ]}
        >
          <Ionicons
            name="help-circle-outline"
            size={18}
            color={theme.colors.textMuted}
          />
          <Text
            style={[styles.insufficientText, { color: theme.colors.textMuted }]}
          >
            Insufficient data. Suitability cannot be assessed without an FPRDI
            strength group.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View>
      <View
        style={[
          styles.legend,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>
          FPRDI strength groups
        </Text>
        {FPRDI_GROUP_SCALE.map((group) => (
          <View key={group.id} style={styles.legendRow}>
            <View
              style={[
                styles.legendBadge,
                { backgroundColor: theme.colors.primarySoft },
              ]}
            >
              <Text
                style={[
                  styles.legendBadgeText,
                  { color: theme.colors.primary },
                ]}
              >
                {group.id}
              </Text>
            </View>
            <Text
              style={[styles.legendText, { color: theme.colors.textMuted }]}
            >
              {group.name}
            </Text>
          </View>
        ))}
        <Text style={[styles.researchNote, { color: theme.colors.textMuted }]}>
          Groups are copied from FPRDI Trade Bulletin No. 4. The app does not
          compute or change them.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {[
          { key: "all" as FilterKey, label: "All", count: entries.length },
          ...filterOptions,
        ].map((option) => {
          const active = filter === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFilter(option.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? theme.colors.primarySoft
                    : theme.colors.surface,
                  borderColor: active
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {option.label} · {option.count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {visible.map(({ species, grading }) => (
          <View
            key={species.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.woodMark, { backgroundColor: species.colorHex }]}
              >
                <Ionicons name="layers-outline" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.cardHeaderCopy}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {species.commonName.replace(" (Coco Lumber)", "")}
                </Text>
                <Text
                  style={[styles.botanical, { color: theme.colors.textMuted }]}
                >
                  {species.botanicalName}
                </Text>
              </View>
            </View>

            {grading.grade ? (
              <View
                style={[
                  styles.gradeBox,
                  {
                    backgroundColor: theme.colors.primarySoft,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.gradeEyebrow, { color: theme.colors.primary }]}
                >
                  FPRDI GROUP {grading.grade.group}
                </Text>
                <Text style={[styles.gradeTitle, { color: theme.colors.text }]}>
                  {
                    FPRDI_GROUP_SCALE.find(
                      (group) => group.id === grading.grade?.group,
                    )?.name
                  }
                </Text>
                <Text
                  style={[
                    styles.gradeDetail,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {grading.grade.detail}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.gradeBox,
                  {
                    backgroundColor: theme.colors.surfaceMuted,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gradeEyebrow,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  STRUCTURAL GRADE
                </Text>
                <Text style={[styles.gradeTitle, { color: theme.colors.text }]}>
                  Insufficient data
                </Text>
                <Text
                  style={[
                    styles.gradeDetail,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  No FPRDI strength group is available for this species.
                </Text>
              </View>
            )}

            {grading.groupingProperties.length > 0 ? (
              <>
                {renderPropertyTable(
                  "GROUPING PROPERTIES · CLEAR-WOOD AVERAGES",
                  grading.groupingProperties,
                )}
                {grading.sampleNote ? (
                  <Text
                    style={[styles.source, { color: theme.colors.textMuted }]}
                  >
                    {grading.sampleNote}
                  </Text>
                ) : null}
                {grading.additionalProperties.length > 0
                  ? renderPropertyTable(
                      "OTHER PRINTED PROPERTIES",
                      grading.additionalProperties,
                    )
                  : null}
              </>
            ) : (
              <View style={styles.block}>
                <Text
                  style={[styles.blockTitle, { color: theme.colors.textMuted }]}
                >
                  FPRDI BULLETIN PROPERTIES
                </Text>
                <View
                  style={[
                    styles.insufficient,
                    { backgroundColor: theme.colors.surfaceMuted },
                  ]}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={theme.colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.insufficientText,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    Insufficient data. This species is not in the FPRDI
                    bulletin.
                  </Text>
                </View>
              </View>
            )}

            {renderSuitability(grading)}

            {grading.research.map(renderResearch)}

            {grading.dataNotes.length > 0 ? (
              <View style={styles.block}>
                {grading.dataNotes.map((note) => (
                  <View key={note} style={styles.noteRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color={theme.colors.warning}
                    />
                    <Text
                      style={[
                        styles.noteText,
                        { color: theme.colors.textMuted },
                      ]}
                    >
                      {note}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {visible.length === 0 ? (
        <View
          style={[styles.empty, { backgroundColor: theme.colors.surfaceMuted }]}
        >
          <Ionicons
            name="funnel-outline"
            size={26}
            color={theme.colors.textMuted}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No species in this group
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.note,
          {
            backgroundColor: theme.colors.accentSoft,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name="shield-outline"
          size={18}
          color={theme.colors.warning}
        />
        <Text style={[styles.noteText, { color: theme.colors.textMuted }]}>
          Values are clear-wood averages and documented end-uses are not
          structural design approval. Design needs allowable stresses,
          load-duration, moisture and defect adjustments, and an engineer’s
          review.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { borderRadius: radius.md, borderWidth: 1, gap: 8, padding: 14 },
  legendTitle: { fontSize: 14, fontWeight: "900", marginBottom: 2 },
  legendRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  legendBadge: {
    alignItems: "center",
    borderRadius: 8,
    height: 26,
    justifyContent: "center",
    width: 34,
  },
  legendBadgeText: { fontSize: 12, fontWeight: "900" },
  legendText: { fontSize: 13 },
  chipScroll: { marginTop: space.lg },
  chips: { gap: 8 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: { fontSize: 12, fontWeight: "800" },
  list: { gap: 10, marginTop: space.md },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: 14 },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: 12 },
  cardHeaderCopy: { flex: 1 },
  woodMark: {
    alignItems: "center",
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  name: { fontSize: 17, fontWeight: "900" },
  botanical: { fontSize: 12, fontStyle: "italic", marginTop: 2 },
  gradeBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  gradeEyebrow: {
    fontSize: typeScale.eyebrow,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginTop: 5,
  },
  gradeDetail: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  block: { marginTop: 16 },
  blockTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  source: { fontSize: 11, lineHeight: 16, marginBottom: 8, marginTop: 2 },
  table: { borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  tableRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableHead: { paddingVertical: 8 },
  headText: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  cellLabel: { flex: 1, fontSize: 12, fontWeight: "700" },
  cellValue: { fontSize: 13, textAlign: "right", width: 66 },
  statusList: { gap: 8 },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  statusCategory: { flex: 1, fontSize: 13, fontWeight: "700" },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { fontSize: 11, fontWeight: "800" },
  insufficient: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  insufficientText: { flex: 1, fontSize: 13, lineHeight: 18 },
  researchEntry: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    padding: 12,
  },
  researchHeading: { fontSize: 13, fontWeight: "900" },
  valueGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10 },
  valueItem: { minWidth: 90 },
  valueLabel: { fontSize: 11, fontWeight: "700" },
  valueText: { fontSize: 13, fontWeight: "900", marginTop: 2 },
  researchNote: { fontSize: 12, lineHeight: 17, marginTop: 8 },
  noteRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  empty: {
    alignItems: "center",
    borderRadius: radius.md,
    marginTop: 10,
    padding: 28,
  },
  emptyTitle: { fontSize: 16, fontWeight: "900", marginTop: 10 },
  note: {
    alignItems: "flex-start",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: space.lg,
    padding: 14,
  },
});
