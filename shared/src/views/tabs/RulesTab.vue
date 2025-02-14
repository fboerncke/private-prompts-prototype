<!-- src/views/tabs/RulesTab.vue -->

<template>
  <v-container class="container" fluid>
    <v-card flat class="rules-card">
      <v-card-title class="rules-header"
        :style="{ borderBottom: '1px solid rgba(var(--v-theme-formFieldBackground))' }">
        <div style="flex: 1; text-align: left;">
          <h4>{{ $t('rulesTab.private-data-definitions') }}</h4>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
          <ImportRuleSetButton label="" color="" />
          <ExportRuleSetButton label="" color="" />
          <v-badge :content="rules.length" color="primary" overlap>
            <ActionButton icon="mdi-plus"
              :tooltip-text="$t('rulesTab.add-rule-tooltip-prefix') + ' ' + rules.length + ' ' + $t('rulesTab.add-rule-tooltip-suffix')"
              variant="flat" size="default" @click="addNewRule" />
          </v-badge>
          &nbsp;
        </div>
      </v-card-title>
    </v-card>

    <v-card flat>
      <v-card-text class="p-0">
        <div class="rules-container">
          <!-- Rules List with Drag-and-Drop -->

          <!-- Use vuedraggable for drag-and-drop functionality -->
          <draggable :animation="0" :list="rules" item-key="id" :use-transition-group="false" handle=".drag-handle"
            @end="onDragEnd">
            <template #item="{ element: rule, index }">
              <div :id="'rule-' + rule.id" :key="rule.id" class="rule-row">
                <!-- Drag Handle -->
                <div class="drag-handle-wrapper">
                  <span class="drag-handle">☰</span>
                </div>

                <div class="form-field-wrapper">
                  <!-- Rule Pattern and Placeholder -->
                  <div class="input-wrapper">
                    <input :ref="'patternField-' + rule.id" v-model="rule.userDefinedSensitiveDataPattern"
                      :class="{ 'is-invalid': !rule.userDefinedSensitiveDataPattern.trim() }" placeholder=" "
                      class="custom-input" @focus="onFieldFocus('pattern', index)" @blur="onFieldBlur('pattern', index)"
                      @keydown.esc="onFieldEsc('pattern', index)">
                    <label class="input-label">{{ $t('rulesTab.sensitive-data-pattern') }}</label>
                  </div>

                  <div class="input-wrapper">
                    <input :ref="'placeholderField-' + rule.id" v-model="rule.userDefinedTemporaryPlaceholder"
                      :class="{ 'is-invalid': !rule.userDefinedTemporaryPlaceholder.trim() }" placeholder=" "
                      class="custom-input" @focus="onFieldFocus('placeholder', index)"
                      @blur="onFieldBlur('placeholder', index)" @keydown.esc="onFieldEsc('placeholder', index)">
                    <label class="input-label">{{ $t('rulesTab.replacement-placeholder') }}</label>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <ActionButton icon="mdi-content-duplicate" size="default" variant="flat"
                    :disabled="isRuleIncomplete(rule)" @click="duplicateRule(index)" />
                  <ActionButton icon="mdi-delete" size="default" variant="flat" @click="deleteRule(index)" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </v-card-text>
    </v-card>

    <!-- Collapsible Help Card -->
    <v-card flat class="rules-card">
      <v-card-title>
        <!-- Toggle-Button für Ein-/Ausklappen -->
        <v-btn variant="text" size="small" @mousedown.prevent="toggleHelpCard">
          <v-icon>{{ isHelpExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          {{ $t('rulesTab.help-text-privacy-rules-explained.title') }}
        </v-btn>
      </v-card-title>

      <!-- Animierte Ein-/Ausklappung nur bei Bedarf anzeigen -->
      <v-expand-transition>
        <v-card-text v-if="isHelpExpanded" class="p-0">
          <div style="font-size: 16px;padding-left: 40px; text-align: left;width:90%;">
            {{ $t('rulesTab.help-text-privacy-rules-explained.intro_1') }}
          </div>
          <div style="font-size: 16px;padding-top: 10px;padding-left: 40px; text-align: left;width:90%;">
            {{ $t('rulesTab.help-text-privacy-rules-explained.intro_2') }}
          </div>
          <div style="font-size: 16px;padding-top: 10px;padding-left: 40px; text-align: left;width:90%;">
            {{ $t('rulesTab.help-text-privacy-rules-explained.intro_3') }}
          </div>

          <hr style="margin: 20px 0; width: 90%; text-align: left;">

          <!-- static replacement rules -->
          <div style="font-size: 16px;padding-left: 40px;">
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.intro-static') }}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.help-text-privacy-rules-explained.sensitive-data-pattern-static') }}</strong>
              </v-col>
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.replacement-placeholder') }}</strong>
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                Marten Solbeck
              </v-col>
              <v-col cols="5" class="text-left">
                John Doe
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                marten.solbeck@gmail.com
              </v-col>
              <v-col cols="5" class="text-left">
                random1234@example.com
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                Elm Street 23
              </v-col>
              <v-col cols="5" class="text-left">
                Some Random Street 42
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.outro-static') }}
              </v-col>
            </v-row>
          </div>
          <hr style="margin: 20px 0; width: 90%; text-align: left;">

          <!-- smart matchers -->
          <div style="font-size: 16px;padding-left: 40px;">
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.intro-smart-matcher') }}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.help-text-privacy-rules-explained.sensitive-data-pattern-smart-matcher')
                  }}</strong>
              </v-col>
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.replacement-placeholder') }}</strong>
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                {email}
              </v-col>
              <v-col cols="5" class="text-left">
                {email}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                {creditcardnumber}
              </v-col>
              <v-col cols="5" class="text-left">
                {creditcardnumber}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                {iban}
              </v-col>
              <v-col cols="5" class="text-left">
                {iban}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                {ipv4}
              </v-col>
              <v-col cols="5" class="text-left">
                {ipv4}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.outro-smart-matcher') }}
              </v-col>
            </v-row>
          </div>

          <hr style="margin: 20px 0; width: 90%; text-align: left;">

          <!-- regular expression -->
          <div style="font-size: 16px;padding-left: 40px;">
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.intro-reg-exp') }}
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.help-text-privacy-rules-explained.sensitive-data-pattern-reg-exp') }}</strong>
              </v-col>
              <v-col cols="5" class="text-left">
                <strong>{{ $t('rulesTab.replacement-placeholder') }}</strong>
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                \d\d\d\d
              </v-col>
              <v-col cols="5" class="text-left">
                1942
              </v-col>
            </v-row>
            <v-row class="table-row">
              <v-col cols="5" class="text-left">
                +49\d+
              </v-col>
              <v-col cols="5" class="text-left">
                +4912345678
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.outro-reg-exp') }}
              </v-col>
            </v-row>
          </div>

          <hr style="margin: 20px 0; width: 90%; text-align: left;">

          <div style="font-size: 16px;padding-left: 40px;">
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.supported-smart-replacement-placeholders-headline') }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="text-left">
                {{ $t('rulesTab.help-text-privacy-rules-explained.supported-smart-replacement-placeholders-text') }}
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="10" class="text-left">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-left">
                        {{
                          $t('rulesTab.help-text-privacy-rules-explained.supported-smart-replacement-placeholders-name')
                        }}
                      </th>
                      <th class="text-left">
                        {{
                          $t('rulesTab.help-text-privacy-rules-explained.supported-smart-replacement-placeholders-example')
                        }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>{number}</code></td>
                      <td>325</td>
                    </tr>
                    <tr>
                      <td><code>{number(10,99)}</code></td>
                      <td>74</td>
                    </tr>
                    <tr>
                      <td><code>{word}</code></td>
                      <td>Zotepori</td>
                    </tr>
                    <tr>
                      <td><code>{date}</code></td>
                      <td>2024-06-18</td>
                    </tr>
                    <tr>
                      <td><code>{date(1990, 2025, "DD.MM.YYYY")}</code></td>
                      <td>03.07.2010</td>
                    </tr>
                    <tr>
                      <td><code>{futureDate}</code></td>
                      <td>2027-02-14</td>
                    </tr>
                    <tr>
                      <td><code>{futureDate(10, "YYYY/MM/DD")}</code></td>
                      <td>2031/05/22</td>
                    </tr>
                    <tr>
                      <td><code>{pastDate}</code></td>
                      <td>2017-09-08</td>
                    </tr>
                    <tr>
                      <td><code>{pastDate(5, "MM-DD-YYYY")}</code></td>
                      <td>03-12-2019</td>
                    </tr>
                    <tr>
                      <td><code>{city}</code></td>
                      <td>Berlin</td>
                    </tr>
                    <tr>
                      <td><code>{iso2}</code></td>
                      <td>DE</td>
                    </tr>
                    <tr>
                      <td><code>{iso3}</code></td>
                      <td>USA</td>
                    </tr>
                    <tr>
                      <td><code>{currency}</code></td>
                      <td>EUR</td>
                    </tr>
                    <tr>
                      <td><code>{price}</code></td>
                      <td>479.99</td>
                    </tr>
                    <tr>
                      <td><code>{price(10, 500, "USD")}</code></td>
                      <td>125.50 USD</td>
                    </tr>
                    <tr>
                      <td><code>{creditCardNumber}</code></td>
                      <td>4532 7890 1234 5678</td>
                    </tr>
                    <tr>
                      <td><code>{cvc}</code></td>
                      <td>847</td>
                    </tr>
                    <tr>
                      <td><code>{iban}</code></td>
                      <td>DE44 5001 0517 5407 3249 31</td>
                    </tr>
                    <tr>
                      <td><code>{iban("FR")}</code></td>
                      <td>FR76 3000 6000 0112 3456 7890 189</td>
                    </tr>
                    <tr>
                      <td><code>{email}</code></td>
                      <td>max.muster@example.com</td>
                    </tr>
                    <tr>
                      <td><code>{email("gmail.com")}</code></td>
                      <td>anna.schmidt@gmail.com</td>
                    </tr>
                    <tr>
                      <td><code>{phonenumber}</code></td>
                      <td>+4915123456789</td>
                    </tr>
                    <tr>
                      <td><code>{ipv4}</code></td>
                      <td>192.168.0.1</td>
                    </tr>
                    <tr>
                      <td><code>{loremIpsum}</code></td>
                      <td>Lorem ipsum dolor sit amet...</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-expand-transition>
    </v-card>

    <!-- Ende Collapsible Help Card -->
    <v-dialog v-model="isDialogVisible" max-width="400px">
      <v-card>
        <v-card-title>{{ $t('rulesTab.incomplete-rule') }}</v-card-title>
        <v-card-text>
          {{ $t('rulesTab.incomplete-rule-dialog-text') }}?
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="deleteRuleById(ruleUnderConfirmation?.id)">
            {{
              $t('rulesTab.incomplete-rule-delete')
            }}
          </v-btn>
          <v-btn variant="text" @click="continueEditing">{{ $t('rulesTab.incomplete-rule-continue') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {
  shallowRef,
  defineComponent,
  nextTick,
  ref,
  getCurrentInstance,
  defineAsyncComponent,
  onMounted
} from "vue";
import draggable from "vuedraggable";
const ActionButton = defineAsyncComponent(() => import('../../components/ActionButton.vue'));

import type { Rule } from "../../interfaces/RuleInterface";
import { useRulesStore } from "../../store/rulesStore";
import { generateUniqueId } from "../../utils/GenericHelpers";
import ExportRuleSetButton from "../../components/importExport/ExportRuleSetButton.vue";
import ImportRuleSetButton from "../../components/importExport/ImportRuleSetButton.vue";
import { useI18n } from 'vue-i18n'

type Field = "pattern" | "placeholder";


const fieldToPropertyMap = {
  pattern: "userDefinedSensitiveDataPattern",
  placeholder: "userDefinedTemporaryPlaceholder",
} as const;

type OriginalValuesEntry = Partial<Record<Field, string>>;

export default defineComponent({
  components: { draggable, ActionButton, ImportRuleSetButton, ExportRuleSetButton },
  setup() {
    const { t } = useI18n();
    const rulesStore = useRulesStore();
    const rules = shallowRef(rulesStore.rules);

    const { saveRules } = rulesStore;
    const originalValues = ref<Record<number, OriginalValuesEntry>>({});
    const rulesContainer = ref<HTMLElement | null>(null);
    const isDialogVisible = ref(false);
    const ruleUnderConfirmation = ref<Rule | null>(null);

    const instance = getCurrentInstance();

    const isHelpExpanded = ref(false);

    function toggleHelpCard() {
      isHelpExpanded.value = !isHelpExpanded.value;
    }
    interface RuleRefs {
      [key: string]: HTMLInputElement | undefined; // Assume refs are inputs
    }
    // Add a new empty rule and focus on the "Sensitive Data Pattern" field
    const addNewRule = async () => {
      const newRule: Rule = {
        id: generateUniqueId(),
        userDefinedSensitiveDataPattern: "",
        userDefinedTemporaryPlaceholder: "",
      };
      rules.value.push(newRule);
      await nextTick();

      // Focus on the new "Sensitive Data Pattern" field
      const patternFieldRefName = "patternField-" + newRule.id;

      // Access $refs with type safety
      const patternFieldComponent = (instance?.proxy?.$refs as RuleRefs)[patternFieldRefName];
      if (patternFieldComponent?.focus) {
        patternFieldComponent.focus();
      }
    };

    const refreshRules = async () => {
      await rulesStore.refreshRules(); // Ensure the rules store is reloaded
      rules.value = rulesStore.rules; // Update the local reactive reference
    };

    // Delete a rule at the specified index
    const deleteRule = (index: number) => {
      rules.value.splice(index, 1);
      saveRules();
    };

    const deleteRuleById = (id: number | undefined) => {
      if (!id) return;

      // Filter out the rule to be deleted
      rules.value = rules.value.filter((rule) => rule.id !== id);

      // Reset dialog state
      ruleUnderConfirmation.value = null;
      isDialogVisible.value = false;

      // Persist changes
      saveRules();
    };

    const continueEditing = async () => {
      if (ruleUnderConfirmation.value) {
        const index = rules.value.findIndex((r) => r.id === ruleUnderConfirmation.value?.id);
        if (index >= 0) {
          // Determine which field to focus
          let field = "";
          if (!rules.value[index].userDefinedSensitiveDataPattern.trim()) {
            field = "patternField";
          } else if (!rules.value[index].userDefinedTemporaryPlaceholder.trim()) {
            field = "placeholderField";
          }

          // Wait for the dialog to close before focusing
          isDialogVisible.value = false;
          await nextTick();

          if (field) {
            const refName = `${field}-${rules.value[index].id}`;
            const fieldComponent = (instance?.proxy?.$refs as RuleRefs)[refName];
            if (fieldComponent?.focus) {
              fieldComponent.focus();
            }
          }
        }
      }

      ruleUnderConfirmation.value = null;
      isDialogVisible.value = false;
    };
    // Duplicate the rule at the specified index and insert it right after the original one
    const duplicateRule = (index: number) => {
      const ruleToDuplicate = { ...rules.value[index], id: generateUniqueId() };
      rules.value.splice(index + 1, 0, ruleToDuplicate);
      saveRules();
    };

    // Handle drag end event to save the new order
    const onDragEnd = () => {
      saveRules();
    };

    const onFieldFocus = (field: Field, index: number) => {
      if (!rules.value[index]) return;
      const ruleId = rules.value[index].id!;
      if (!originalValues.value[ruleId]) {
        originalValues.value[ruleId] = {};
      }
      const propertyName = fieldToPropertyMap[field];

      // Store the original value for resetting on ESC
      if (originalValues.value[ruleId][field] === undefined) {
        originalValues.value[ruleId][field] = rules.value[index][propertyName];
      }
    };

    // Show the dialog
    const showConfirmationDialog = (rule: Rule) => {
      ruleUnderConfirmation.value = rule;
      isDialogVisible.value = true;
    };

    // Hide the dialog
    const closeDialog = () => {
      ruleUnderConfirmation.value = null;
      isDialogVisible.value = false;
    };

    const onFieldBlur = (_field: Field, index: number) => {
      const rule = rules.value[index];
      if (!rule) return;

      // Delay to allow the next focus event to be processed
      setTimeout(() => {
        const isFocusedWithinSameRule = document.activeElement?.closest(`#rule-${rule.id}`);
        if (!isFocusedWithinSameRule && isRuleIncomplete(rule)) {
          // Show the confirmation dialog only if focus is not moving within the same rule
          ruleUnderConfirmation.value = rule;
          isDialogVisible.value = true;
        } else {
          saveRules();
        }
      }, 50); // Add a slight delay to allow focus transition
    };

    // Add a state to track the rule under confirmation
    const isRuleIncomplete = (rule: Rule): boolean => {
      return (
        !rule.userDefinedSensitiveDataPattern.trim() ||
        !rule.userDefinedTemporaryPlaceholder.trim()
      );
    };

    // Handle ESC key to revert changes
    const onFieldEsc = (field: Field, index: number) => {
      if (!rules.value[index]) return;
      const ruleId = rules.value[index].id!;
      const propertyName = fieldToPropertyMap[field];

      // Restore the original value even if current value is empty
      if (
        originalValues.value[ruleId] &&
        originalValues.value[ruleId][field] !== undefined
      ) {
        // Restore the original value
        rules.value[index][propertyName] = originalValues.value[ruleId][
          field
        ] as string;
      }
    };

    // Refresh the rules when the component is mounted
    onMounted(() => {
      refreshRules();
    });

    return {
      rules,
      refreshRules,
      addNewRule,
      deleteRule,
      duplicateRule,
      onFieldFocus,
      onFieldBlur,
      onFieldEsc,
      onDragEnd,
      rulesContainer,
      ImportRuleSetButton,
      ExportRuleSetButton,
      deleteRuleById,
      continueEditing,
      ruleUnderConfirmation,
      showConfirmationDialog,
      closeDialog,
      isDialogVisible,
      isRuleIncomplete,
      isHelpExpanded,
      toggleHelpCard,
      t
    };
  },
});
</script>

<style scoped>
.container {
  padding: 16px;
  padding-top: 0px;
}

.rules-container {
  overflow-y: auto;
  background-color: var(--v-background-base);
}

.rules-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

/* Rule row styles */
.rule-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid var(--v-border-color);
  position: relative;
  color: var(--v-on-surface);
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-row:hover {
  background-color: var(--v-theme-overlay-light);
}

.drag-handle-wrapper {
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-handle {
  cursor: ns-resize;
  font-size: 16px;
  padding-top: 17px;
  color: var(--v-on-surface);
}

.form-field-wrapper {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-grow: 1;
  align-items: flex-start;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* Input styles */
.custom-input {
  width: 100%;
  padding: 23px 12px 4px 12px;
  margin: 0;
  border: 1px solid rgba(var(--v-theme-formFieldBackground));
  border-radius: 10px;
  font-size: 16px;
  background-color: rgba(var(--v-theme-formFieldBackground));
  transition: background-color 0.2s, border-color 0.2s;
}

.custom-input::placeholder {
  color: var(--v-on-surface-variant);
}

.custom-input:hover {
  background-color: rgba(var(--v-theme-formFieldBackgroundHover, 1));
  border: 1px solid rgba(var(--v-theme-formFieldBackgroundHover, 1));
}

.custom-input:focus {
  border-color: rgba(var(--v-theme-formFieldBackgroundFocus, 1));
  background-color: rgba(var(--v-theme-formFieldBackgroundFocus, 1));
  outline: none;

}

.custom-input:focus+.input-label,
.custom-input:not(:placeholder-shown)+.input-label {
  top: 5px;
  font-size: 12px;
  color: rgba(var(--v-theme-formFieldDescriptionFont, 1));
  background-color: transparent;
  transform: none;
}

/* Input Label */
.input-label {
  position: absolute;
  left: 9px;
  top: 24px;
  font-size: 16px;
  color: var(--v-on-surface-variant, #757575);
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  background-color: transparent;
  padding: 0 4px;
  white-space: nowrap;
}

/* Action buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
  padding-left: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.action-button:hover {
  color: var(--v-primary-base);
}

.rule-row:hover .action-buttons {
  opacity: 1;
  pointer-events: auto;
}

.is-invalid {
  border-color: red !important;
  background-color: #ffe6e6;
  /* Light red background */
}

.table-row {
  border: 1px solid rgba(197, 190, 190, 0.12);
  padding: 8px 0;
  width: 90%;
}
</style>
