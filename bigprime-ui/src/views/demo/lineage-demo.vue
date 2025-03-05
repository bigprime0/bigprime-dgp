<template>
  <div id='cy' ref="cyContainer" style="width: 600px; height: 400px; display: block;"></div>
</template>

<script setup lang="ts">
import cytoscape from 'cytoscape'
import { onMounted, ref } from 'vue'

const cyContainer = ref()

onMounted(() => {
  init()
})

const stylesheet:any = [
  {
    selector: 'node',
    style: {
      height: 10,
      width: 10,
      content: 'data(id)',
      'text-valign': 'top',
      'text-halign': 'right',
      'font-size': 10,
      'color': '#35393e',
      'background-color': '#2fc1d3',
      'border-color': '#000',
      'border-width': 1,
      'border-opacity': 0.8
    }
  },
  {
    selector: ':parent',
    style: {
      'content': (elem: any) => elem.data()['type'] + ': ' + elem.data()['id'],
      'font-size': 16,
      'font-weight': 'bold',
      'text-halign': 'center',
      'text-valign': 'top'
    }
  },
  {
    selector: ':parent[type = "Table"], :parent[type = "Path"]',
    style: {
      'background-color': '#f5f5f5',
      'border-color': '#00516c'
    }
  },
  {
    selector: ':parent[type = "SubQuery"]',
    style: {
      'background-color': '#f5f5f5',
      'border-color': '#b46c4f'
    }
  },
  {
    selector: ':parent[type = "Table or SubQuery"]',
    style: {
      'background-color': '#f5f5f5',
      'border-color': '#b46c4f',
      'border-style': 'dashed'
    }
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#9ab5c7',
      'target-arrow-color': '#9ab5c7',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.8,
      'curve-style': 'unbundled-bezier'
    }
  },
  {
    selector: '.highlight',
    style: {
      'background-color': '#076fa1'
    }
  },
  {
    selector: '.highlight_locked',
    style: {
      'background-color': '#e99708'
    }
  },
  {
    selector: '.semitransparent',
    style: { 'opacity': '0.2' }
  },
  {
    selector: 'node[temporary]',
    style: {
      'background-color': '#f5f5f5',
      'border-color': '#b46c4f',
      'border-style': 'dashed',
      'content': (elem: any) => elem.data()['type'] + ': ' + elem.data()['id'],
      'font-size': 16,
      'font-weight': 'bold',
      'shape': 'rectangle',
      'text-halign': 'center',
      'text-valign': 'top'
    }
  },
  {
    selector: 'edge[temporary]',
    style: {
      'line-color': '#b46c4f',
      'line-style': 'dashed',
      'target-arrow-color': '#b46c4f'
    }
  }
]

const init = () => {
  const cy = cytoscape({
    container: cyContainer.value,
    style: stylesheet,
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      {
        data: {
          source: 'a',
          target: 'b'
        }
      }
    ],
    layout: {
      name: 'grid'
    }
  })
  cy.on('mouseover', 'node', function(e) {
    let sel = e.target
    // current node has parent node: children node to highlight in column lineage
    // or no parent node in the graph, meaning table lineage: every node is children node
    if (sel.parent().size() > 0 || cy.elements().filter((node: any) => node.isParent()).size() === 0) {
      let elements = sel.union(sel.successors()).union(sel.predecessors())
      elements.addClass('highlight')
      cy.elements().filter((node: any) => node.isChild()).difference(elements).addClass('semitransparent')
    }
    // if current node has parent candidates in column lineage mode, add them temporarily
    let parents = sel.data().parent_candidates
    if (parents !== undefined && parents.length > 1) {
      let tmp_elem = parents.map((p: any) => [
        { 'data': { 'id': p.name, 'type': p.type, 'temporary': true } },
        {
          'data': {
            'id': sel.data().id + '-' + p.name,
            'source': sel.data().id,
            'target': p.name,
            'temporary': true
          }
        }
      ]).reduce((x: any, y: any) => x.concat(y))
      if (cy.elements().filter(n => n.data().temporary === true).size() === 0) {
        let zoom = cy.zoom()
        let pan = cy.pan()
        cy.add(tmp_elem)
        cy.elements().filter(n => n.data().temporary === undefined).lock()
        cy.elements().filter(n => n.data().temporary === true || n.data().id === sel.data().id)
          .layout({
            'boundingBox': {
              'x1': sel.position().x,
              'y1': sel.position().y,
              'w': 200,
              'h': 200
            },
            'circle': true,
            'name': 'breadthfirst'
          })
          .run()
        cy.viewport({
          'zoom': zoom,
          'pan': pan
        })
      }
    }
  })
  cy.on('mouseout', 'node', function() {
    cy.elements().removeClass('semitransparent')
    cy.elements().removeClass('highlight')
    cy.remove(cy.elements().filter(n => n.data().temporary === true))
    cy.elements().filter(n => n.data().temporary === undefined).unlock()
  })
  // click to lock
  cy.removeListener('click', 'node')
  cy.on('click', 'node', e => {
    let sel = e.target
    let columnLevel = cy.elements().some((e: any) => e.isNode() && e.data().type === 'Column')
    if (sel.data().type === 'Column' || !columnLevel) {
      let elements = sel.union(sel.successors()).union(sel.predecessors())
      if (columnLevel) {
        elements = elements.filter((e: any) => e.isNode() && e.data().type === 'Column')
      }
      if (elements.every((e: any) => e.hasClass('highlight_locked'))) {
        elements.removeClass('highlight_locked')
      } else {
        elements.addClass('highlight_locked')
      }
    }
  })
  // unbundled-cubic-bezier curve style for edges, reference: https://github.com/cytoscape/cytoscape.js/issues/2579
  cy.edges().forEach(edge => {
    if (edge.source() !== edge.target()) {
      const x0 = edge.source().position('x')
      const x1 = edge.target().position('x')
      const y0 = edge.source().position('y')
      const y1 = edge.target().position('y')
      const x = x1 - x0
      const y = y1 - y0
      const z = Math.sqrt(x * x + y * y)
      const costheta = x / z
      const alpha = 0.2
      const controlPointDistances = [-alpha * y * costheta, alpha * y * costheta]
      edge.style('control-point-distances', controlPointDistances)
      edge.style('control-point-weights', [alpha, 1 - alpha])
    }
  })
}
</script>

<style scoped lang="less">
</style>
