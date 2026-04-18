import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Modal, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { Button } from './Button';
import { DragIcon } from './DragIcon';
import { TrashIcon } from './TrashIcon';

type RoutineCardProps = {
  name: string;
  editMode: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
};

export function RoutineCard({ name, editMode, onPress, onLongPress, onRename, onDelete }: RoutineCardProps) {
  const { theme } = useThemeContext();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState(name);

  // Sincroniza el valor local si cambia la prop name
  useEffect(() => {
    setRenameValue(name);
  }, [name]);

  return (
    <>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {name}
          </Text>
          {editMode ? <DragIcon color={theme.textMuted} size={20} /> : null}
        </View>

        {editMode ? (
          <View style={styles.actions}>
            <Button title="Renombrar" onPress={() => setShowRenameModal(true)} variant="ghost" />
            <Button title="" onPress={onDelete} variant="danger" icon={<TrashIcon color="#fff" size={16} />} />
          </View>
        ) : null}
      </Pressable>

      {/* Modal para renombrar */}
      <Modal visible={showRenameModal} animationType="slide" transparent onRequestClose={() => setShowRenameModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setShowRenameModal(false)} />
          <View style={{ backgroundColor: theme.surface, padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Renombrar rutina</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  drag: {
    marginLeft: 12,
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});