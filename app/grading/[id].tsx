import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "../../components/ui/AppScreen";
import { radius, space, typeScale } from "../../constants/appTheme";
import {
  FPRDI_GROUP_SCALE,
  getGrading,
  GradingProperty,
  ResearchBlock,
  SUITABILITY_CATEGORIES,
  SuitabilityStatus,
} from "../../constants/structuralGrading";
import { useAppTheme } from "../../hooks/useAppTheme";

const STATUS_LABEL: Record<SuitabilityStatus, string> = {
  D: "Documented",
  "D*": "Group-level only",
  V: "Verify",
  N: "Outside documented",
  I: "Insufficient data",
};

const formatValue = (value: number | null) =>
  value === null ? "—" : value.toFixed(2);

export default function GradingDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const item = getGrading(id);

  if (!item) {
    return (
      <AppScreen contentContainerStyle={styles.missing}>
        <View
          style={[
            styles.missingIcon,
            { backgroundColor: theme.colors.warningSoft },
          ]}
        >
          <Ionicons
            name="layers-outline"
            size={28}
            color={theme.colors.warning}
          />
        </View>
        <Text style={[styles.missingTitle, { color: theme.colors.text }]}>
          Species not found
        </Text>
        <Text style={[styles.missingText, { color: theme.colors.textMuted }]}>
          This species is not in the structural grading data.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.back, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.backText, { color: theme.colors.textOnStrong }]}>
            Back to catalog
          </Text>
        </TouchableOpacity>
      </AppScreen>
    );
  }

  const groupName = item.grade
    ? FPRDI_GROUP_SCALE.find((group) => group.id === item.grade?.group)?.name
    : null;

  const statusColors = (status: SuitabilityStatus) => {
    switch (status) {
      case "D":
        return { bg: theme.colors.primarySoft, fg: theme.colors.success };
      case "D*":
        return { bg: theme.colors.primarySoft, fg: theme.colors.primary };
      case "V":
        return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
      case "N":
        return { bg: theme.colors.surfaceMuted, fg: theme.colors.danger };
      default:
        return { bg: theme.colors.surfaceMuted, fg: theme.colors.textMuted };
    }
  };

  const renderTable = (rows: GradingProperty[]) => (
    <View style={[styles.table, { borderColor: theme.colors.border }]}>
      <View
        style={[
          styles.tableRow,
          { backgroundColor: theme.colors.surfaceMuted, paddingVertical: 8 },
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
      {rows.map((row) => (
        <View
          key={row.label}
          style={[
            styles.tableRow,
            { borderTopColor: theme.colors.border, borderTopWidth: 1 },
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
  );

  const renderResearch = (block: ResearchBlock) => (
    <View
      key={block.title}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.cardHeading}>
        <View
          style={[styles.icon, { backgroundColor: theme.colors.accentSoft }]}
        >
          <Ionicons
            name="flask-outline"
            size={18}
            color={theme.colors.warning}
          />
        </View>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          {block.title}
        </Text>
      </View>
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
            {entry.values.map((value) => (
              <View key={value.label} style={styles.valueItem}>
                <Text
                  style={[styles.valueLabel, { color: theme.colors.textMuted }]}
                >
                  {value.label}
                </Text>
                <Text style={[styles.valueText, { color: theme.colors.text }]}>
                  {value.value}
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

  return (
    <AppScreen>
      <View
        style={[styles.hero, { backgroundColor: theme.colors.surfaceStrong }]}
      >
        <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>
          STRUCTURAL GRADING
        </Text>
        <Text style={[styles.name, { color: theme.colors.textOnStrong }]}>
          {item.commonName}
        </Text>
        <Text style={styles.botanical}>{item.botanicalName}</Text>
        <View style={styles.heroRule} />
        {item.grade ? (
          <>
            <Text
              style={[styles.heroGroup, { color: theme.colors.textOnStrong }]}
            >
              FPRDI Group {item.grade.group} · {groupName}
            </Text>
            <Text style={styles.heroDetail}>{item.grade.detail}</Text>
          </>
        ) : (
          <>
            <Text
              style={[styles.heroGroup, { color: theme.colors.textOnStrong }]}
            >
              Insufficient data
            </Text>
            <Text style={styles.heroDetail}>
              No FPRDI strength group is available for this species.
            </Text>
          </>
        )}
        {item.sampleNote ? (
          <Text style={styles.heroDetail}>{item.sampleNote}</Text>
        ) : null}
      </View>

      {item.groupingProperties.length > 0 ? (
        <>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.cardHeading}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: theme.colors.primarySoft },
                ]}
              >
                <Ionicons
                  name="barbell-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Grouping properties
              </Text>
            </View>
            <Text style={[styles.source, { color: theme.colors.textMuted }]}>
              Clear-wood averages used by FPRDI to assign the group.
            </Text>
            {renderTable(item.groupingProperties)}
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.cardHeading}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: theme.colors.primarySoft },
                ]}
              >
                <Ionicons
                  name="list-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Other printed properties
              </Text>
            </View>
            {renderTable(item.additionalProperties)}
          </View>
        </>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeading}>
            <View
              style={[
                styles.icon,
                { backgroundColor: theme.colors.surfaceMuted },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={theme.colors.textMuted}
              />
            </View>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              FPRDI bulletin properties
            </Text>
          </View>
          <Text style={[styles.body, { color: theme.colors.textMuted }]}>
            Insufficient data. This species is not in the FPRDI bulletin.
          </Text>
        </View>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.cardHeading}>
          <View
            style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}
          >
            <Ionicons
              name="construct-outline"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Documented end-uses
          </Text>
        </View>
        {item.suitability ? (
          <>
            <View style={styles.statusList}>
              {SUITABILITY_CATEGORIES.map((category) => {
                const status = item.suitability
                  ? item.suitability[category]
                  : "I";
                const colors = statusColors(status);
                return (
                  <View key={category} style={styles.statusRow}>
                    <Text
                      style={[
                        styles.statusCategory,
                        { color: theme.colors.text },
                      ]}
                    >
                      {category}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        { backgroundColor: colors.bg },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: colors.fg }]}>
                        {STATUS_LABEL[status]}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <Text
              style={[styles.researchNote, { color: theme.colors.textMuted }]}
            >
              Based on the end-uses FPRDI lists for Group {item.grade?.group}.
              “Outside documented” means not documented for the group, not proof
              of failure. “Group-level only” means no species-specific
              durability data exists.
            </Text>
          </>
        ) : (
          <Text style={[styles.body, { color: theme.colors.textMuted }]}>
            Insufficient data. Suitability cannot be assessed without an FPRDI
            strength group.
          </Text>
        )}
      </View>

      {item.research.map(renderResearch)}

      {item.dataNotes.length > 0 ? (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.cardHeading}>
            <View
              style={[
                styles.icon,
                { backgroundColor: theme.colors.warningSoft },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.warning}
              />
            </View>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Data notes
            </Text>
          </View>
          {item.dataNotes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <Ionicons
                name="ellipse"
                size={6}
                color={theme.colors.textMuted}
                style={{ marginTop: 7 }}
              />
              <Text
                style={[styles.noteText, { color: theme.colors.textMuted }]}
              >
                {note}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View
        style={[
          styles.disclaimer,
          { backgroundColor: theme.colors.accentSoft },
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
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.lg, padding: space.lg },
  eyebrow: {
    fontSize: typeScale.eyebrow,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  name: { fontSize: 30, fontWeight: "900", letterSpacing: -1, marginTop: 8 },
  botanical: {
    color: "#DCE8DE",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
  },
  heroRule: {
    backgroundColor: "rgba(255,255,255,0.18)",
    height: 1,
    marginTop: 18,
  },
  heroGroup: { fontSize: 17, fontWeight: "900", marginTop: 14 },
  heroDetail: { color: "#DCE8DE", fontSize: 13, lineHeight: 19, marginTop: 5 },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: space.md,
    padding: space.md,
  },
  cardHeading: { alignItems: "center", flexDirection: "row", gap: 10 },
  icon: {
    alignItems: "center",
    borderRadius: radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "900" },
  body: { fontSize: 14, lineHeight: 21, marginTop: 13 },
  source: { fontSize: 11, lineHeight: 16, marginBottom: 10, marginTop: 10 },
  table: { borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  tableRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headText: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  cellLabel: { flex: 1, fontSize: 12, fontWeight: "700" },
  cellValue: { fontSize: 13, textAlign: "right", width: 66 },
  statusList: { gap: 10, marginTop: 14 },
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
  researchNote: { fontSize: 12, lineHeight: 17, marginTop: 10 },
  noteRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  disclaimer: {
    alignItems: "flex-start",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 10,
    marginTop: space.lg,
    padding: 14,
  },
  missing: { alignItems: "center", flexGrow: 1, justifyContent: "center" },
  missingIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  missingTitle: { fontSize: 20, fontWeight: "900", marginTop: 14 },
  missingText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "center",
  },
  back: {
    borderRadius: radius.md,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: { fontSize: 14, fontWeight: "900" },
});
