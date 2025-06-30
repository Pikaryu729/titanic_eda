import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { PieChartData } from "@/types/piechart";

interface PieChartEntry {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData;
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
  onSliceClick?: (label: string, value: number, index: number) => void;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  innerRadius = 0,
  outerRadius = Math.min(width, height) / 2 - 10,
  showLabels = true,
  showLegend = true,
  colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ],
  className = "",
  onSliceClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !Object.keys(data).length) return;

    // Convert data object to array format
    const dataArray: PieChartEntry[] = Object.entries(data).map(
      ([label, value]) => ({
        label,
        value,
      })
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const centerX = width / 2;
    const centerY = height / 2;

    // Create pie generator
    const pie = d3
      .pie<PieChartEntry>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<PieChartEntry>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Create label arc (slightly outside the main arc)
    const labelArc = d3
      .arc<d3.PieArcDatum<PieChartEntry>>()
      .innerRadius(outerRadius - 80)
      .outerRadius(outerRadius - 80);

    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Create pie slices
    const arcs = g
      .selectAll(".arc")
      .data(pie(dataArray))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add paths (pie slices)
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => colors[i % colors.length])
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", onSliceClick ? "pointer" : "default")
      .on("click", function (d) {
        if (onSliceClick) {
          onSliceClick(d.data.label, d.data.value, d.index);
        }
      })
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
      });

    // Add labels if enabled
    if (showLabels) {
      arcs
        .append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#374151")
        .text((d) => {
          const total = d3.sum(dataArray, (d) => d.value);
          const percentage = ((d.data.value / total) * 100).toFixed(1);
          return `${d.data.label} (${percentage}%)`;
        });
    }
  }, [
    data,
    width,
    height,
    innerRadius,
    outerRadius,
    showLabels,
    colors,
    onSliceClick,
  ]);

  return (
    <div className={`pie-chart-container ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="pie-chart-svg"
      />

      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {Object.entries(data).map(([label, value], index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />
              <span className="text-sm font-medium text-black">
                {label}: {value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
