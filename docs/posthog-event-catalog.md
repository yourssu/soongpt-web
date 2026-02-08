# PostHog Funnel Event Catalog

This document describes all PostHog events currently emitted by the web app funnel tracking implementation.

## 1. Global Rules

- Tracking backend: `posthog-js`
- Wrapper file: `src/bootstrap/posthog.ts`
- Transition plugin: `src/stackflow/plugins/posthogFunnelPlugin.ts`
- PII policy for event payloads: non-identifying data only (code/category/count/length/status)
- API request tracking: not used

## 2. Common Properties (auto-attached to every event)

The wrapper automatically injects the following properties for all events:

| Property         | Type     | Source                                 |
| ---------------- | -------- | -------------------------------------- |
| `env`            | `string` | `import.meta.env.MODE`                 |
| `funnel_name`    | `string` | constant: `course_to_timetable_2026_1` |
| `funnel_version` | `number` | constant: `1`                          |
| `surface`        | `string` | constant: `web`                        |

## 3. Event Name Catalog

### 3.1 `funnel_activity_viewed`

Recorded by `PostHog.trackActivityViewed(activity, properties)`.

Trigger:

- Stackflow plugin `onPushed`
- Stackflow plugin `onReplaced`

Core properties:

| Key        | Type                       | Notes                                              |
| ---------- | -------------------------- | -------------------------------------------------- |
| `activity` | `ActivityName`             | type-safe activity name                            |
| `source`   | `on_pushed \| on_replaced` | plugin hook source                                 |
| `activity` | `object`                   | raw `effect.activity` object from stackflow plugin |

---

### 3.2 `funnel_step_viewed`

Recorded by `PostHog.trackStepViewed(step, properties)`.

Trigger:

- Stackflow plugin `onPushed` when `activity.params.type` exists (`source=activity_params`)
- Stackflow plugin `onStepPushed` (`source=step_push`)
- Stackflow plugin `onStepReplaced` (`source=step_replace`)

Core properties:

| Key        | Type                                           | Notes                                                          |
| ---------- | ---------------------------------------------- | -------------------------------------------------------------- |
| `step`     | `string`                                       | step type string                                               |
| `source`   | `activity_params \| step_push \| step_replace` | plugin hook source                                             |
| `activity` | `object`                                       | raw `effect.activity` object                                   |
| `step`     | `object \| undefined`                          | raw `effect.step` object (or latest step on `activity_params`) |

---

### 3.3 `funnel_back_navigation`

Recorded by `PostHog.trackBackNavigation(activity, backType, properties)`.

Trigger:

- Stackflow plugin `onPopped` (`backType=activity_pop`, `source=on_popped`)
- Stackflow plugin `onStepPopped` (`backType=step_pop`, `source=on_step_popped`)

Core properties:

| Key        | Type                          | Notes                             |
| ---------- | ----------------------------- | --------------------------------- |
| `activity` | `ActivityName`                | activity name                     |
| `backType` | `activity_pop \| step_pop`    | navigation type                   |
| `source`   | `on_popped \| on_step_popped` | plugin hook source                |
| `activity` | `object`                      | raw `effect.activity` object      |
| `step`     | `object \| undefined`         | raw step object for step-pop path |

---

### 3.4 `funnel_activity_cta_clicked`

Recorded by `PostHog.trackActivityCtaClicked(activity, cta, properties)`.

Current CTA matrix:

| Activity                     | CTA                                 | Extra properties                                       |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `onboarding`                 | `save_user_information`             | `grade`, `schoolId`, `semester`, `teachTrainingCourse` |
| `course_selection`           | `create_timetable_click`            | `selectedCourseCount`, `selectedCredit`                |
| `course_selection`           | `open_course_search`                | `selectedCourseCount`, `selectedCredit`                |
| `course_selection`           | `remove_course_click`               | `courseCode`                                           |
| `course_search`              | `max_credit_blocked`                | `courseCode`, `currentCredit`, `selectedCredit`        |
| `timetable_suggest`          | `create_timetable_from_suggestion`  | `selectedSuggestionIndex`                              |
| `timetable_delete`           | `delete_conflict_course_and_create` | `selectedCourseCode`                                   |
| `timetable_delete`           | `back_to_course_selection`          | none                                                   |
| `timetable_guide`            | `back_to_course_selection`          | none                                                   |
| `general_elective_selection` | `course_conflict_blocked`           | `courseCode`                                           |
| `general_elective_selection` | `go_to_chapel`                      | none                                                   |
| `chapel_selection`           | `expand_chapel_sheet`               | none                                                   |
| `chapel_selection`           | `finalize_timetable`                | none                                                   |
| `timetable_result`           | `referral_event_click`              | none                                                   |

---

### 3.5 `funnel_step_next_clicked`

Recorded by `PostHog.trackStepNextClicked(step, properties)`.

Current step values:

- `RETAKE`
- `MAJOR_PREREQUISITE`
- `MAJOR_REQUIRED`
- `MAJOR_ELECTIVE`
- `DOUBLE_MAJOR`
- `MINOR`
- `TEACHING_CERTIFICATE`
- `GENERAL_REQUIRED`
- `COURSE_SELECTION_RESULT`

Common properties:

| Key                   | Type     |
| --------------------- | -------- |
| `selectedCourseCount` | `number` |
| `selectedCredit`      | `number` |

---

### 3.6 `funnel_field_changed`

Recorded by `PostHog.trackFieldChanged(field, properties)`.

Current field matrix:

| Field                                     | Where                       | Extra properties                           |
| ----------------------------------------- | --------------------------- | ------------------------------------------ |
| `onboarding_grade_changed`                | onboarding select           | `grade`                                    |
| `onboarding_semester_changed`             | onboarding select           | `semester`                                 |
| `onboarding_school_id_changed`            | onboarding select           | `schoolId`                                 |
| `onboarding_department_input_changed`     | onboarding input            | `hasValue`, `inputLength`, `dropdownCount` |
| `onboarding_department_selected`          | onboarding dropdown pick    | `inputLength`                              |
| `onboarding_sub_department_input_changed` | onboarding input            | `hasValue`, `inputLength`, `dropdownCount` |
| `onboarding_sub_department_selected`      | onboarding dropdown pick    | `inputLength`                              |
| `onboarding_teach_training_toggled`       | onboarding toggle           | `selected`                                 |
| `major_elective_grade_chip_changed`       | major elective chip         | `selectedGrades`                           |
| `major_elective_other_major_toggled`      | major elective toggle       | `selected`                                 |
| `double_major_tab_changed`                | double major tab            | `tab`                                      |
| `minor_tab_changed`                       | minor tab                   | `tab`                                      |
| `teaching_certificate_tab_changed`        | teaching tab                | `tab`                                      |
| `timetable_suggestion_toggled`            | suggestion selection        | `selected`, `selectedSuggestionIndex`      |
| `timetable_delete_course_toggled`         | delete proposal selection   | `selected`, `selectedCourseCode`           |
| `general_elective_field_chip_toggled`     | general elective field chip | `selected`, `valueLength`                  |

---

### 3.7 `funnel_search_updated`

Recorded by `PostHog.trackSearchUpdated(scope, properties)`.

Current scope matrix:

| Scope                   | Extra properties                                 |
| ----------------------- | ------------------------------------------------ |
| `course_search`         | `keywordLength`                                  |
| `course_search_results` | `keywordLength`, `resultCount`                   |
| `major_elective`        | `keywordLength`, `resultCount`, `selectedGrades` |

---

### 3.8 `funnel_course_toggled`

Recorded by `PostHog.trackCourseToggled(scope, properties)`.

Core properties:

| Key          | Type                  | Notes                                  |
| ------------ | --------------------- | -------------------------------------- |
| `scope`      | `string`              | feature area                           |
| `courseCode` | `number`              | course identifier                      |
| `selected`   | `boolean`             | state after toggle intent              |
| `category`   | `string \| undefined` | course category                        |
| `credit`     | `number \| undefined` | course point                           |
| `source`     | `string \| undefined` | optional source (e.g. `course_search`) |

Current scopes:

- `course_selection`
- `course_search`
- `general_elective_selection`
- `chapel_selection`

---

### 3.9 `funnel_modal_decision`

Recorded by `PostHog.trackModalDecision(scope, decision, properties)`.

Current scope matrix:

| Scope                         | Decision            | Extra properties           |
| ----------------------------- | ------------------- | -------------------------- |
| `course_remove`               | `confirm \| cancel` | `courseCode`               |
| `course_search_add_or_remove` | `confirm \| cancel` | `actionType`, `courseCode` |

---

### 3.10 `funnel_stage_completed`

Recorded by `PostHog.trackFunnelStageCompleted(stage, properties)`.

Current stage matrix:

| Stage                   | Extra properties                                  |
| ----------------------- | ------------------------------------------------- |
| `onboarding`            | `grade`, `schoolId`, `semester`                   |
| `course_selection`      | `selectedCourseCount`, `selectedCredit`, `status` |
| `timetable_recommended` | `selectedSuggestionIndex`                         |
| `general_elective`      | `selectedGeneralElectiveCount`                    |
| `chapel`                | `selectedChapel`                                  |
| `timetable_finalized`   | `selectedChapel`, `selectedGeneralElectiveCount`  |

## 4. Identify (not an event capture)

User identity is set by:

- `PostHog.setUser(student)` in onboarding submit path.

This calls `posthog.identify(...)` and is separate from the funnel capture events above.
