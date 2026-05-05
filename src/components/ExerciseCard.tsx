import { Pressable, StyleSheet, Text, View, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { toKg } from '../utils/helpers';
import { Button } from './Button';
import { DragIcon } from './DragIcon';
import { TrashIcon } from './TrashIcon';

type ExerciseCardProps = {
  name: string;
  weight: number;
  record: number;
  sets: string;
  editMode: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onLongPress?: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onEditWeight?: () => void;
  onEditSets?: (newSets: string) => void;
  onFocusSetsInput?: () => void;
};

export function ExerciseCard(props: ExerciseCardProps) {
  const {
    name,
    weight,
    record,
    sets,
    editMode,
    onIncrease,
    onDecrease,
    onLongPress,
    onRename,
    onDelete,
    onEditWeight,
    onEditSets,
    onFocusSetsInput,
  } = props;
  const { theme } = useThemeContext();
  const [editingSets, setEditingSets] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState(name);

  function parseSets(sets: string) {
    const match = sets.match(/^(\d+)\s*[xX]\s*(.+)$/);
    if (match) return { series: match[1], reps: match[2] };
    if (/^\d+$/.test(sets)) return { series: sets, reps: '' };
    return { series: '', reps: sets };
  }
  const [seriesValue, setSeriesValue] = useState(parseSets(sets).series);
  const [repsValue, setRepsValue] = useState(parseSets(sets).reps);

  useEffect(() => {
    if (!editingSets) {
      const parsed = parseSets(sets);
      setSeriesValue(parsed.series);
      setRepsValue(parsed.reps);
    }
  }, [sets, editingSets]);

  useEffect(() => {
    setRenameValue(name);
  }, [name]);

  return (
    <Pressable
      onLongPress={onLongPress}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
        {editMode ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={onDelete}
              style={{
                backgroundColor: '#c62828',
                borderRadius: 6,
                padding: 4,
                marginRight: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={8}
            >
              <TrashIcon color="#fff" size={20} />
            </Pressable>
            <DragIcon color={theme.textMuted} size={20} />
          </View>
        ) : null}
      </View>
      <View style={styles.metrics}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.value, { color: theme.text }]}>Peso: {toKg(weight)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable
              onPress={onDecrease}
              hitSlop={8}
              style={{
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>-2.5</Text>
            </Pressable>
            <Pressable
              onPress={onIncrease}
              hitSlop={8}
              style={{
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>+2.5</Text>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.value, { color: theme.text }]}>Récord: {toKg(record)}</Text>
        <Text style={[styles.value, { color: theme.textMuted }]}>Series: {sets}</Text>
      </View>

      {/* Modal para editar series/reps */}
      <Modal visible={editingSets} animationType="slide" transparent onRequestClose={() => setEditingSets(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setEditingSets(false)} />
          <View style={{ backgroundColor: theme.surface, padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Editar series y repeticiones</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textMuted, marginBottom: 4 }}>Series</Text>
                <TextInput
                  style={[
                    styles.value,
                    styles.input,
                    { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                    editingSets && { borderColor: theme.primary, borderWidth: 2 },
                  ]}
                  value={seriesValue}
                  onChangeText={setSeriesValue}
                  placeholder=""
                  placeholderTextColor={theme.textMuted}
                  keyboardType="number-pad"
                  returnKeyType="next"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textMuted, marginBottom: 4 }}>Repeticiones</Text>
                <TextInput
                  style={[
                    styles.value,
                    styles.input,
                    { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                    editingSets && { borderColor: theme.primary, borderWidth: 2 },
                  ]}
                  value={repsValue}
                  onChangeText={setRepsValue}
                  placeholder=""
                  placeholderTextColor={theme.textMuted}
                  keyboardType="default"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    setEditingSets(false);
                    if (onEditSets && seriesValue.trim() && repsValue.trim()) {
                      const newSets = `${seriesValue.trim()}x${repsValue.trim()}`;
                      if (newSets !== sets) onEditSets(newSets);
                    }
                  }}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Cancelar" variant="ghost" onPress={() => setEditingSets(false)} />
              <Button title="Guardar" onPress={() => {
                setEditingSets(false);
                if (onEditSets && seriesValue.trim() && repsValue.trim()) {
                  const newSets = `${seriesValue.trim()}x${repsValue.trim()}`;
                  if (newSets !== sets) onEditSets(newSets);
                }
              }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal para renombrar ejercicio */}
      <Modal visible={showRenameModal} animationType="slide" transparent onRequestClose={() => setShowRenameModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setShowRenameModal(false)} />
          <View style={{ backgroundColor: theme.surface, padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Renombrar ejercicio</Text>
            <TextInput
              style={{
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderRadius: 6,
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 8,
                marginBottom: 16,
              }}
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Nuevo nombre"
              placeholderTextColor={theme.textMuted}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (renameValue.trim() && renameValue !== name) {
                  onRename(renameValue.trim());
                }
                setShowRenameModal(false);
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Cancelar" variant="ghost" onPress={() => setShowRenameModal(false)} />
              <Button title="Guardar" onPress={() => {
                if (renameValue.trim() && renameValue !== name) {
                  onRename(renameValue.trim());
                }
                setShowRenameModal(false);
              }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {editMode ? (
        <View style={styles.actions}>
          <Button title="Renombrar" onPress={() => setShowRenameModal(true)} variant="ghost" />
          {onEditWeight && <Button title="Editar peso" onPress={onEditWeight} variant="ghost" />}
          <Button title="Editar series/reps" onPress={() => setEditingSets(true)} variant="ghost" />
          <Button 
            title="" 
            onPress={onDelete} 
            variant="danger" 
            icon={<TrashIcon color="#fff" size={16} />} 
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  drag: {
    marginLeft: 12,
    fontSize: 18,
  },
  metrics: {
    gap: 4,
  },
  value: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    minWidth: 60,
    height: 28,
    fontSize: 14,
    marginRight: 4,
  },
});