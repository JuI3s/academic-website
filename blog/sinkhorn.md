---
title: "Sinkhorn iteration as alternating minimization of generalized KL divergence"
author: "Julius Zhang"
date: 2026-08-19
tags:
  - optimal-transport
  - computational-mathematics
  - machine-learning
---

Recall that a matrix is doubly stochastic if all the row and column sums are 1 --- that is, each column and row represents a probability distribution. Doubly stochastic matrices show up ubiquitously in computational optimal transport, where they correspond to some notion of the cost matrix. A natural question is the following: given a matrix with positive entries, find the nearest doubly stochastic matrix in some metric.

This can be solved by Sinkhorn iteration, which amounts to iteratively renormalizing the column and row entries, so that they sum up to 1.

```text
Input: K > 0 (square matrix)
P <- K
repeat until convergence:
    P <- diag(1 / (P 1)) * P          # normalize rows to sum to 1
    P <- P * diag(1 / (P^T 1))        # normalize columns to sum to 1
return P
```

Here, `1` is the all-ones vector. So `P 1` is the vector of row sums of `P`,
and `P^T 1` is the vector of column sums of `P` (division is elementwise).

**Closest neighbour by generalized KL-divergence**

Like many problems in applied mathematics and statistics, one gains a lot of perspectives by embedding it into an optimization problem, where the desired formula corresponds to the optimal solution set of some objective function to be minimized. This is the perspective in [Csiszár (1975)](https://doi.org/10.1214/aop/1176996454), which does not appear to show up in common exposition in the machine learning literature.

Specifically, denote the space of row (resp. col) normalized matrices by
$$
\mathcal{C}_r = \{P \ge 0 : P\mathbf{1}_n = \mathbf{1}_n\},
$$
$$
\mathcal{C}_c = \{P \ge 0 : P^\top \mathbf{1}_n = \mathbf{1}_n\},
$$
so that $\mathcal{C}_r \cap \mathcal{C}_c$ is the set of doubly stochastic matrices. Given a target matrix $K$, we want to solve the optimization problem of finding the nearest element in the feasible set of doubly stochastic matrices, i.e.

$$
P^\star
= \arg\min_{P \in \mathcal{C}_r \cap \mathcal{C}_c}
D_{\mathrm{KL}}(P \,\|\, K),
$$
where $D_{\mathrm{KL}}(P \,\|\, K)$ is the generalized KL divergence (I-divergence), i.e.

$$
D_{\mathrm{KL}}(P \,\|\, K)
= \sum_{i,j}\left(P_{ij}\log\frac{P_{ij}}{K_{ij}} - P_{ij} + K_{ij}\right).
$$
The alternating minimization form is
$$
P^{(2t+1)}=\arg\min_{P\in\mathcal{C}_r}D_{\mathrm{KL}}(P\,\|\,P^{(2t)}).
$$
$$
P^{(2t+2)}=\arg\min_{P\in\mathcal{C}_c}D_{\mathrm{KL}}(P\,\|\,P^{(2t+1)}).
$$

Without loss of generality, we focus on the row-normalization step. Fix
$A:=P^{(2t)}$ and solve
$$
Q^\star=\arg\min_{Q\in\mathcal{C}_r}D_{\mathrm{KL}}(Q\,\|\,A).
$$
$$
\mathcal{C}_r=\{Q\ge 0:Q\mathbf{1}_n=\mathbf{1}_n\}.
$$
Its Lagrangian is
$$
\mathcal{L}(Q,\lambda)=
\sum_{i,j}\!\left(Q_{ij}\log\frac{Q_{ij}}{A_{ij}}-Q_{ij}+A_{ij}\right)
+\sum_i \lambda_i\!\left(\sum_j Q_{ij}-1\right).
$$
Differentiate with respect to $Q_{ij}$ gives
$$
\frac{\partial \mathcal{L}}{\partial Q_{ij}}
=\log\frac{Q_{ij}}{A_{ij}}+\lambda_i=0
\quad\Longrightarrow\quad
Q_{ij}=A_{ij}e^{-\lambda_i}.
$$
Enforcing the row constraints gives
$$
\sum_j Q_{ij}=e^{-\lambda_i}\sum_j A_{ij}
$$
$$
e^{-\lambda_i}\sum_j A_{ij}=1
$$
$$
e^{-\lambda_i}=\frac{1}{\sum_j A_{ij}}.
$$
Hence
$$
Q^\star=\mathrm{diag}\!\left(\frac{1}{A\mathbf{1}_n}\right)A,
$$
which is exactly the Sinkhorn row-normalization update.

**Convergence**

Interestingly, the KL-divergence is not a metric, but it satisfies a ''triangle equality'' for distributions at each Sinkhorn iteration update. For example, take $R$ to be a doubly stochastic matrix; then we have

$$
D_{\mathrm{KL}}(R \,\|\, P^{k}) = D_{\mathrm{KL}}(R \,\|\, P^{k + 1}) + D_{\mathrm{KL}}(P^{k+1} \,\|\, P^{k}),
$$
which follows from the general formula for how the generalized KL-divergence behaves under the ''triangle equality'', where the correction terms vanish for distributions coming from doubly stochastic matrices. Therefore, by a telescoping argument, the increment $D_{\mathrm{KL}}(P^{k+1} \,\|\, P^{k})$ goes to zero. Convergence of follows from strict convexity and standard arguments about convergence on compact sets, since vanishing KL increment means that any accumulation point is fixed by the alternating KL projections, hence doubly stochastic.
