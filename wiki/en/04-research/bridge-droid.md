# BridgeData V2 & DROID: Large-Scale Robot Manipulation Datasets

*ICRA 2024 / arXiv 2024* (BridgeData V2, DROID)

---

## 1) Brief summary (public date, authors)

### BridgeData V2

- **Public date:** 2023-08 (arXiv v1 posted **2023-08-24**)
- **arXiv:** [2308.12952](https://arxiv.org/abs/2308.12952)
- **Authors (representative):** Homer Walke, Kevin Black, Abraham Lee, Moo Jin Kim, Chongyi Zheng, Tony Zhao, Philippe Hansen-Estruch, Quan Vuong, Andre He, Vivek Myers, Kuan Fang, Chelsea Finn, Sergey Levine (UC Berkeley, Stanford)

### DROID

- **Public date:** 2024-03 (arXiv v1 posted **2024-03-19**)
- **arXiv:** [2403.12945](https://arxiv.org/abs/2403.12945)
- **Authors (representative):** Alexander Khazatsky, Karl Pertsch, Suraj Nair, Ashwin Balakrishna, Sudeep Dasari, Siddharth Karamcheti, Soroush Nasiriany, Mohan Kumar Srirama, Lawrence Yunliang Chen, and many others (Stanford, UC Berkeley, and 50+ institutions)

---

## 2) Detailed summary

### Two Complementary Approaches to Robot Data

BridgeData V2 and DROID are often cited together because they represent two complementary strategies for scaling robot demonstration data:

- **BridgeData V2:** Depth (single robot type, many tasks, ~24 environments)
- **DROID:** Breadth (many robots, many environments, "in-the-wild" real-world diversity)

### BridgeData V2: A Kitchen Benchmark

**Scale:** ~60,000 trajectories collected with WidowX robots in kitchen-like environments

**Composition:**
- WidowX 250 robot arms (standardized hardware)
- Kitchen-like tabletop setup (~24 different kitchen lab arrangements)
- Tasks: pick-and-place, pouring, drawer manipulation, folding, unpacking, etc.
- Language annotations: each trajectory annotated with natural language task descriptions
- Fully open-source and downloadable

**Why it matters:**
- First *public* real-robot benchmark for evaluating generalist policies
- Enabled fair comparison between OpenVLA, Octo, RT-2, and others
- Task diversity within a single robot ensures hardware isn't the bottleneck; purely a test of policy generalization

### DROID: In-The-Wild Diversity

**Scale:** ~76,000 trajectories collected using Franka Panda arms across diverse environments

**Composition:**
- **86+ diverse, real-world environments:** homes, offices, labs, cafes, warehouses
- **50+ institutions contributed data:** standardized collection protocol and teleoperation setup
- **Franka Panda arms with identical grippers:** hardware consistency, environment variability
- Language annotations: similar to BridgeData V2
- Tasks span household, office, and industrial manipulation

**Key innovation:** "In-the-wild" data collection demonstrated that real-world environmental diversity (lighting, clutter, object variety, layout) produces more robust policies than lab-curated data.

### Comparison: Depth vs Breadth

| Dimension | BridgeData V2 | DROID |
|----|----|----|
| Scale | ~60k trajectories | ~76k trajectories |
| Robot | WidowX (single type) | Franka Panda (single type) |
| Environments | ~24 lab setups | 86+ real-world locations |
| Primary use | Benchmark evaluation | Pretraining + evaluation |
| Learning focus | Task generalization | Environment generalization |
| Hardware standardization | Very high | High |

### Results from Evaluations

**BridgeData V2 as benchmark:**
- OpenVLA (7B): 73.7% success rate
- RT-2-X (55B): 67.3% success rate
- Octo-Base: 56.9% success rate (zero-shot, improves dramatically with fine-tuning)

**DROID pretraining effect:**
- Models trained on DROID + fine-tuned on downstream task outperform models trained from scratch
- Zero-shot DROID evaluation shows better environmental robustness than single-lab-trained policies

### Limitations

**BridgeData V2:**
- Single robot type limits morphological diversity
- Lab environment doesn't capture real-world clutter and lighting variation
- ~60k videos is becoming the "minimum" — many papers now expect larger datasets

**DROID:**
- Franka-only arm limits generalization to other morphologies
- Harder to clearly attribute successes to data quality vs environment diversity
- Collection across 50+ institutions introduced some inconsistency in labeling and data quality

---

## 3) Why these datasets matter

- **BridgeV2 established the public evaluation gold standard:** Without a public benchmark, comparing models was nearly impossible. BridgeV2's kitchen tasks became THE reference point for robot learning papers (2023 onward)
- **DROID shifted the priority from scale to diversity:** Demonstrated that environment diversity (real homes vs labs) matters as much as task diversity; challenged the "bigger dataset is always better" assumption
- **Together they validated two scaling directions:** depth (task variety on fixed hardware) and breadth (environmental variety on fixed hardware), both improve generalization
- **Enabled the VLA era:** OpenVLA, Octo, and π0 all benchmarked against BridgeData V2 and trained on OXE (which aggregates DROID-like diversity). Without these public datasets, the whole movement would have stalled

---

## 4) What Config can apply

- **Benchmark targets:** BridgeV2 success rates (OpenVLA 73.7%, RT-2-X 67.3% on kitchen tasks) are the key external baselines. Config should aim to exceed these on bimanual dexterous tasks
- **Task vs environment diversity trade-off:** DROID's finding that environment diversity rivals task diversity suggests Config should collect across different real kitchens/factories/labs, not just Config's single facility
- **Public benchmarking:** If Config builds a bimanual dexterous manipulation benchmark (parallel to BridgeV2), it enables external comparison and community contributions. This accelerates research
- **Language annotation discipline:** Both BridgeData V2 and DROID maintain consistent language annotations (one sentence per trajectory). Config should enforce the same rigor — enables future language-conditioned policies
- **Data collection at scale:** DROID's multi-institutional protocol (50+ partners contributing) is a template for scaling data collection. Config could partner with robotics labs to grow data without internal overhead, similar to DROID's approach

