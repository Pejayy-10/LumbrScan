import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { radius, space } from "../../../constants/appTheme";
import {
  FPRDI_GROUP_SCALE,
  FprdiGroupId,
  GradingProperty,
  SpeciesGrading,
  STRUCTURAL_GRADING,
} from "../../../constants/structuralGrading";
import { SUPPORTED_SPECIES_IDS } from "../../../constants/supportedSpecies";
import { useAppTheme } from "../../../hooks/useAppTheme";

type FilterKey = "all" | FprdiGroupId | "insufficient";

const GROUP_ORDER: FprdiGroupId[] = ["I", "II", "III", "IV", "V"];

const keyOf = (item: SpeciesGrading): FilterKey =>
  item.grade ? item.grade.group : "insufficient";

const findProperty = (rows: GradingProperty[], label: string) =>
  rows.find((row) => row.label.startsWith(label));

export function StructuralGradingView() {
  const theme = useAppTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const presentGroups = useMemo(
    () => new Set(STRUCTURAL_GRADING.map(keyOf)),
    [],
  );

  const filterOptions = useMemo(() => {
    const keys: FilterKey[] = [
      ...GROUP_ORDER.filter((group) => presentGroups.has(group)),
      ...(presentGroups.has("insufficient")
        ? (["insufficient"] as FilterKey[])
        : []),
    ];
    return [
      {
        key: "all" as FilterKey,
        label: "All",
        count: STRUCTURAL_GRADING.length,
      },
      ...keys.map((key) => ({
        key,
        label: key === "insufficient" ? "Insufficient data" : `Group ${key}`,
        count: STRUCTURAL_GRADING.filter((item) => keyOf(item) === key).length,
      })),
    ];
  }, [presentGroups]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return STRUCTURAL_GRADING.filter((item) => {
      if (filter !== "all" && keyOf(item) !== filter) return false;
      if (!normalized) return true;
      const groupText = item.grade
        ? `group ${item.grade.group} ${FPRDI_GROUP_SCALE.find((g) => g.id === item.grade?.group)?.name ?? ""}`
        : "insufficient data";
      return `${item.commonName} ${item.botanicalName} ${groupText}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [filter, query]);

  return (
    <View>
      {/* FPRDI scale: one compact row */}
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
        <View style={styles.tiles}>
          {FPRDI_GROUP_SCALE.map((group) => {
            const present = presentGroups.has(group.id);
            return (
              <View
                key={group.id}
                style={[
                  styles.tile,
                  {
                    backgroundColor: present
                      ? theme.colors.primarySoft
                      : theme.colors.surfaceMuted,
                    borderColor: present
                      ? theme.colors.primary
                      : theme.colors.border,
                    opacity: present ? 1 : 0.6,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tileNumeral,
                    {
                      color: present
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {group.id}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.tileLabel, { color: theme.colors.textMuted }]}
                >
                  {group.short}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.scaleEnds}>
          <Text style={[styles.scaleEnd, { color: theme.colors.textMuted }]}>
            Strongest
          </Text>
          <Text style={[styles.scaleEnd, { color: theme.colors.textMuted }]}>
            Weakest
          </Text>
        </View>
        <Text style={[styles.legendNote, { color: theme.colors.textMuted }]}>
          Copied from FPRDI Trade Bulletin No. 4. The app does not compute or
          change groups.
        </Text>
      </View>

      {/* Search */}
      <View
        style={[
          styles.search,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={19}
          color={theme.colors.textMuted}
        />
        <TextInput
          accessibilityLabel="Search structural grading"
          placeholder="Search species or group"
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.primary}
          style={[styles.input, { color: theme.colors.text }]}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <TouchableOpacity
            accessibilityLabel="Clear grading search"
            accessibilityRole="button"
            onPress={() => setQuery("")}
          >
            <Ionicons
              name="close-circle"
              size={19}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {filterOptions.map((option) => {
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

      <Text style={[styles.count, { color: theme.colors.textMuted }]}>
        {visible.length} {visible.length === 1 ? "species" : "species"} · card
        values are green-condition averages
      </Text>

      {/* Compact cards. Full data opens on the detail screen. */}
      <View style={styles.list}>
        {visible.map((item) => {
          const mor = findProperty(item.groupingProperties, "MOR");
          const moe = findProperty(item.groupingProperties, "MOE");
          const density = findProperty(
            item.groupingProperties,
            "Relative density",
          );
          const hasData = item.groupingProperties.length > 0;
          const scannerSupported = (
            SUPPORTED_SPECIES_IDS as readonly string[]
          ).includes(item.id);
          const stats = [
            { label: "MOR", value: mor?.green, unit: "MPa" },
            { label: "MOE", value: moe?.green, unit: "GPa" },
            { label: "DENSITY", value: density?.green, unit: "" },
          ];

          return (
            <TouchableOpacity
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.commonName} structural grading`}
              activeOpacity={0.82}
              onPress={() => router.navigate(`/grading/${item.id}`)}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View
                  style={[styles.woodMark, { backgroundColor: item.colorHex }]}
                >
                  <Ionicons name="leaf-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.cardCopy}>
                  <Text
                    numberOfLines={1}
                    style={[styles.name, { color: theme.colors.text }]}
                  >
                    {item.commonName}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.botanical,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    {item.botanicalName}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={theme.colors.textMuted}
                />
              </View>

              <View style={styles.badges}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.grade
                        ? theme.colors.primarySoft
                        : theme.colors.surfaceMuted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: item.grade
                          ? theme.colors.primary
                          : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {item.grade
                      ? `Group ${item.grade.group} · ${FPRDI_GROUP_SCALE.find((g) => g.id === item.grade?.group)?.short}`
                      : "Insufficient data"}
                  </Text>
                </View>
                {scannerSupported ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.colors.accentSoft },
                    ]}
                  >
                    <Ionicons
                      name="scan-outline"
                      size={12}
                      color={theme.colors.warning}
                    />
                    <Text
                      style={[
                        styles.badgeText,
                        { color: theme.colors.warning },
                      ]}
                    >
                      Scanner
                    </Text>
                  </View>
                ) : null}
              </View>

              {hasData ? (
                <View style={styles.stats}>
                  {stats.map((stat) => (
                    <View
                      key={stat.label}
                      style={[
                        styles.stat,
                        { backgroundColor: theme.colors.surfaceMuted },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statLabel,
                          { color: theme.colors.textMuted },
                        ]}
                      >
                        {stat.label}
                      </Text>
                      <Text
                        style={[styles.statValue, { color: theme.colors.text }]}
                      >
                        {stat.value == null ? "—" : stat.value.toFixed(2)}
                        {stat.value != null && stat.unit ? (
                          <Text
                            style={[
                              styles.statUnit,
                              { color: theme.colors.textMuted },
                            ]}
                          >{` ${stat.unit}`}</Text>
                        ) : null}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text
                  style={[styles.noData, { color: theme.colors.textMuted }]}
                >
                  Not in the FPRDI bulletin. Open for the research values that
                  exist.
                </Text>
              )}

              {item.sampleNote ? (
                <Text
                  style={[styles.sample, { color: theme.colors.textMuted }]}
                >
                  {item.sampleNote}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {visible.length === 0 ? (
        <View
          style={[styles.empty, { backgroundColor: theme.colors.surfaceMuted }]}
        >
          <Ionicons
            name="search-outline"
            size={26}
            color={theme.colors.textMuted}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No species found
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            Try a species name or “group II”.
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
          Clear-wood averages from FPRDI data. These are not structural design
          values. “Scanner” marks the three species the offline model can
          identify.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { borderRadius: radius.md, borderWidth: 1, padding: 14 },
  legendTitle: { fontSize: 14, fontWeight: "900" },
  tiles: { flexDirection: "row", gap: 6, marginTop: 12 },
  tile: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  tileNumeral: { fontSize: 15, fontWeight: "900" },
  tileLabel: { fontSize: 9, fontWeight: "800", marginTop: 3 },
  scaleEnds: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  scaleEnd: { fontSize: 10, fontWeight: "700" },
  legendNote: { fontSize: 11, lineHeight: 16, marginTop: 10 },
  search: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: space.md,
    minHeight: 52,
    paddingHorizontal: 15,
  },
  input: { flex: 1, fontSize: 14, minHeight: 48 },
  chipScroll: { marginTop: space.sm },
  chips: { gap: 8 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: { fontSize: 12, fontWeight: "800" },
  count: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: space.md,
  },
  list: { gap: 10 },
  card: { borderRadius: radius.md, borderWidth: 1, padding: 14 },
  cardTop: { alignItems: "center", flexDirection: "row", gap: 12 },
  woodMark: {
    alignItems: "center",
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  cardCopy: { flex: 1 },
  name: { fontSize: 17, fontWeight: "900" },
  botanical: { fontSize: 12, fontStyle: "italic", marginTop: 2 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  badge: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 11, fontWeight: "800" },
  stats: { flexDirection: "row", gap: 8, marginTop: 12 },
  stat: {
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  statLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  statValue: { fontSize: 14, fontWeight: "900", marginTop: 3 },
  statUnit: { fontSize: 10, fontWeight: "700" },
  noData: { fontSize: 12, lineHeight: 17, marginTop: 12 },
  sample: { fontSize: 11, marginTop: 10 },
  empty: {
    alignItems: "center",
    borderRadius: radius.md,
    marginTop: 10,
    padding: 28,
  },
  emptyTitle: { fontSize: 16, fontWeight: "900", marginTop: 10 },
  emptyText: { fontSize: 13, marginTop: 4 },
  note: {
    alignItems: "flex-start",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: space.lg,
    padding: 14,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
