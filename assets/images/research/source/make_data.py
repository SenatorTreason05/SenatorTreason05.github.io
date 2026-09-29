"""Generate the numeric data read by the .tex figures in this folder.

    python make_data.py

edge-dual.dat
    The real dual curve of the Edge quartic
        C: 25(x^4 + y^4 + z^4) - 34(x^2 y^2 + x^2 z^2 + y^2 z^2) = 0,
    the curve in Ranestad-Seigal-Wang, arXiv:2409.01356, Example / Fig. 1.
    C_R lies in the chart z = 1 (it has no real points at infinity), so we trace
    it exactly in polar coordinates -- along the ray at angle theta the equation
    is a quadratic in r^2 -- and send each point p to its tangent line grad F(p),
    written in the chart w = 1 of the dual plane as (u, v) = (F_x/F_z, F_y/F_z).
    Segments are separated by "nan nan" rows (pgfplots: unbounded coords=jump).

astronomy-points.dat
    Twenty uniformly random observation times of the multiperiodic signal in
    Bellinger's Multiperiod src/simulation.m, with that script's uniform noise
    on [0, err]. The MATLAB script draws them unseeded; we fix a seed so the
    figure is reproducible.

The script also checks the region labels of determinantal.tex by counting the
real intersection points of C with the line u x + v y + z = 0.
"""

import math
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
WINDOW = 3.5


def grad(x, y, z=1.0):
    fx = 100 * x**3 - 68 * x * (y**2 + z**2)
    fy = 100 * y**3 - 68 * y * (x**2 + z**2)
    fz = 100 * z**3 - 68 * z * (x**2 + y**2)
    return fx, fy, fz


def quartic_branches(n=40000):
    """Points of C_R in the chart z=1, as runs of consecutive (x, y)."""
    runs, cur = [], {+1: [], -1: []}
    for k in range(n + 1):
        th = 2 * math.pi * k / n
        c, s = math.cos(th), math.sin(th)
        a = 25 * (c**4 + s**4) - 34 * c**2 * s**2
        disc = 34**2 - 100 * a
        ok = a > 0 and disc >= 0
        for sign in (+1, -1):
            if ok:
                r2 = (34 + sign * math.sqrt(disc)) / (2 * a)
                if r2 > 0:
                    r = math.sqrt(r2)
                    cur[sign].append((r * c, r * s))
                    continue
            if cur[sign]:
                runs.append((sign, cur[sign]))
                cur[sign] = []
    runs += [(sgn, pts) for sgn, pts in cur.items() if pts]
    return runs


def ovals():
    """Close each theta-interval into an oval: + branch out, - branch back."""
    runs = quartic_branches()
    plus = [p for s, p in runs if s > 0]
    minus = [p for s, p in runs if s < 0]
    loops = []
    for P in plus:
        # the matching - run shares its endpoints (where the discriminant vanishes)
        M = min(minus, key=lambda m: math.dist(m[0], P[0]) + math.dist(m[-1], P[-1]))
        loops.append(P + M[::-1] + [P[0]])
    return loops


def dual_segments():
    segs = []
    for loop in ovals():
        cur = []
        for x, y in loop:
            fx, fy, fz = grad(x, y)
            u, v = (fx / fz, fy / fz) if abs(fz) > 1e-12 else (math.inf, math.inf)
            inside = abs(u) <= WINDOW * 1.08 and abs(v) <= WINDOW * 1.08
            if inside and cur and math.dist(cur[-1], (u, v)) > 0.5:
                segs.append(cur)
                cur = []
            if inside:
                cur.append((u, v))
            elif cur:
                segs.append(cur)
                cur = []
        if cur:
            segs.append(cur)
    return [thin(s) for s in segs if len(s) > 1]


def thin(seg, tol=0.004):
    """Drop points closer than tol to the last kept one (keeps the file small)."""
    out = [seg[0]]
    for p in seg[1:-1]:
        if math.dist(p, out[-1]) >= tol:
            out.append(p)
    out.append(seg[-1])
    return out


def real_points_on_line(u, v):
    """Number of real points of C on the line u x + v y + z = 0."""
    # parametrize the line as P(t) = P0 + t D in homogeneous coordinates
    n = np.array([u, v, 1.0])
    D = np.cross(n, [0.3, 0.7, 0.1]); P0 = np.cross(n, D)
    def F(p):
        x, y, z = p
        return 25 * (x**4 + y**4 + z**4) - 34 * (x*x*y*y + x*x*z*z + y*y*z*z)
    ts = np.linspace(-2, 2, 5)
    coeffs = np.polyfit(ts, [F(P0 + t * D) for t in ts], 4)
    roots = np.roots(coeffs)
    real = sum(abs(r.imag) < 1e-7 for r in roots)
    # a root at t = infinity corresponds to the point D itself
    return real + (4 - (len(roots))) * (abs(F(D)) < 1e-9)


LABELS = [  # (u, v, count) as printed in the paper's Fig. 1, one octant; symmetric under D4
    (2.8, 2.8, 4), (0, 2.8, 0), (1.3, 2.5, 2), (2.5, 1.3, 2), (2.8, 0, 0),
    (0, 1.3, 4), (1.3, 0, 4), (1.0, 1.1, 0), (0.5, 0.5, 2), (0, 0, 0),
]


def main():
    segs = dual_segments()
    with open(HERE / "edge-dual.dat", "w", newline="\n") as f:
        for i, s in enumerate(segs):
            if i:
                f.write("nan nan\n")
            for u, v in s:
                f.write(f"{u:.4f} {v:.4f}\n")
    print(f"edge-dual.dat: {len(segs)} segments, {sum(map(len, segs))} points")

    for u, v, want in LABELS:
        for su, sv in ((1, 1), (-1, 1), (1, -1), (-1, -1)):
            for a, b in ((su * u, sv * v), (sv * v, su * u)):
                got = real_points_on_line(a, b)
                assert got == want, f"region label at ({a}, {b}): expected {want}, found {got}"
    print("region labels verified against real intersection counts")

    rng = np.random.default_rng(20)
    num_points, err, x_max = 20, 0.1, 10 * 2 * math.pi
    ust = np.sort(rng.uniform(0, x_max, num_points))
    noise = rng.uniform(0, err, num_points)
    m = lambda t: (np.sin(t) + 0.4 * np.sin(2 * t + np.pi / 4)
                   + 0.2 * np.sin(0.71 * t + np.pi) + 0.1 * np.sin(0.71 * 8 * t + np.pi / 15))
    usm = m(ust) + noise
    with open(HERE / "astronomy-points.dat", "w", newline="\n") as f:
        f.write("t m err\n")
        for t, y in zip(ust, usm):
            f.write(f"{t:.4f} {y:.4f} {2 * err:.2f}\n")
    print("astronomy-points.dat: 20 observations")


if __name__ == "__main__":
    main()
