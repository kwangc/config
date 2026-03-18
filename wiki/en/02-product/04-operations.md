# Operations / Human-in-the-loop

Operations connect human-in-the-loop data acquisition, labeling, and quality gating to rapid task-specific model deployment.

---

## Core goal: rapid adaptation to a target robot/task

From the tech preview, a typical adaptation flow is:

1. **Design an acquisition strategy** informed by the target robot’s physical characteristics and sensing constraints.
2. **Collect a small amount of target task teleoperation data.**
3. **Fine-tune CFG-1** into a task-specific model (typically completed within **~24 hours**).
4. **Improve via online rollouts** with human-in-the-loop intervention (strategy + data refinement).
5. **Deploy within ~48 hours**, iterating until the system reliably performs the task.

---

## What humans do during online improvement

During rollouts, the policy will be suboptimal early. Humans intervene to:

- recover from failures
- expand the visited state space (so data becomes less biased toward earlier trajectories)
- refine the data acquisition strategy (reduce unnecessary variance via guidance)

The tech preview shows this can be observed through trajectory consistency and workspace coverage expansion across rounds.

---

## Labeling & quality operations

Operations also ensure that “data remains usable”:

- maintain **data lineage/versioning**
- track quality defined by **precision + accuracy + diversity**
- add failure reason attribution so the next data batch targets the right gap

---

## See also

- [Data Platform](../01-data-platform.md/)
- [Foundation Model](../02-foundation-model.md/)
