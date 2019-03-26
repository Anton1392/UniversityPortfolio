import javax.swing.*;
import java.util.Arrays;

public class RouterNode
{
  private int myID;
  private GuiTextArea myGUI;
  private RouterSimulator sim;
  private int[] costs = new int[RouterSimulator.NUM_NODES];

  private int[] nextHops = new int[RouterSimulator.NUM_NODES];
  // So initial routes aren't forgotten.
  private int[] initialCosts = new int[RouterSimulator.NUM_NODES];
  // Which nodes are this nodes neighbors.
  private boolean[] isNeighbors = new boolean[RouterSimulator.NUM_NODES];
  // Tables of known neighbors.
  private int[][] neighborTables = new int[RouterSimulator.NUM_NODES][RouterSimulator.NUM_NODES];

  // Change in constructor to toggle.
  private boolean usePoisonReverse;

  //--------------------------------------------------
  public RouterNode(int ID, RouterSimulator sim, int[] costs)
  {
    // CHANGE THIS TO ENABLE/DISABLE POISON REVERSE.
    usePoisonReverse = true;

    myID = ID;
    this.sim = sim;
    myGUI = new GuiTextArea("  Output window for Router #"+ ID + "  ");

    System.arraycopy(costs, 0, this.costs, 0, RouterSimulator.NUM_NODES);
    System.arraycopy(costs, 0, this.initialCosts, 0, RouterSimulator.NUM_NODES);

    initializeHopsAndNeighbors();
    initializeNeighborTables();

    // Intial updates to neighbors.
    for (int i = 0; i < isNeighbors.length; i++)
    {
      if (isNeighbors[i])
      {
        sendUpdate(new RouterPacket(myID, i, costs));
      }
    }
  }

  // Initializes next hops and neighbors.
  private void initializeHopsAndNeighbors()
  {
    for (int i = 0; i < RouterSimulator.NUM_NODES; i++)
    {
      if(costs[i] != RouterSimulator.INFINITY) // Direct neighbor
      {
        nextHops[i] = i;
        isNeighbors[i] = true;
      }
      else
      {
        nextHops[i] = -1; // Can't directly hop to it, need middleman router.
        isNeighbors[i] = false;
      }
    }

    nextHops[myID] = myID; // Should go through me to get to me.
    isNeighbors[myID] = false; // Not my own neighbor.
  }

  // Simply initialize to infinity. Default for Java is 0 otherwise.
  private void initializeNeighborTables()
  {
    for(int i = 0; i < neighborTables.length; i++)
    {
      for (int j = 0; j < neighborTables[i].length; j++)
      {
        neighborTables[i][j] = RouterSimulator.INFINITY;
      }
    }
  }

  //--------------------------------------------------
  public void recvUpdate(RouterPacket pkt)
  {
    // Creates temporary variables for recalculating routes.
    int[] initialCostCopy = new int[RouterSimulator.NUM_NODES];
    int[] tempNextHops = new int[RouterSimulator.NUM_NODES];
    System.arraycopy(initialCosts, 0, initialCostCopy, 0, RouterSimulator.NUM_NODES);

    // Updates the neighbor-table when recieving a table from said neighbor.
    System.arraycopy(pkt.mincost, 0, neighborTables[pkt.sourceid], 0, RouterSimulator.NUM_NODES);

    myGUI.println("RECIEVED UPDATE FROM: " + pkt.sourceid);

    // Initializes the temporary next hop array.
    for(int i = 0; i < tempNextHops.length; i++)
    {
      // If immediate neighbors or myself, set the nexthop of i to itself.
      if(isNeighbors[i] || i == myID)
      {
        tempNextHops[i] = i;
      }
      // Else not directly connected.
      else
      {
        tempNextHops[i] = -1;
      }
    }

    // Calculates the minimum costs from neighbor table.
    for(int i = 0; i < neighborTables.length; i++)
    {
      for(int j = 0; j < neighborTables[i].length; j++)
      {
        // Only calculate for neighbors, can't route to indirect routers.
        if(isNeighbors[j])
        {
          // If a shorter path is found, update the cost- and nexthop-table.
          if(initialCostCopy[j] + neighborTables[j][i] < initialCostCopy[i])
          {
            initialCostCopy[i] = initialCostCopy[j] + neighborTables[j][i];
            tempNextHops[i] = tempNextHops[j];
          }
        }
      }
    }

    // If changes have happened to the costs
    if(!Arrays.equals(costs, initialCostCopy))
    {
      // Save the changes
      System.arraycopy(initialCostCopy, 0, costs, 0, RouterSimulator.NUM_NODES);
		  System.arraycopy(tempNextHops, 0, nextHops, 0, RouterSimulator.NUM_NODES);

      // Alert neighbors of changes.
      alertAllNeighbors();
    }
  }

  private void alertAllNeighbors()
  {
    for(int i = 0; i < RouterSimulator.NUM_NODES; i++)
    {
      if(isNeighbors[i])
      {
        int[] to_send = new int[RouterSimulator.NUM_NODES];
        System.arraycopy(costs, 0, to_send, 0, RouterSimulator.NUM_NODES);

        if(usePoisonReverse)
        {
          // If we route through i to get to j:
          // Advertise infinite distance from self to j.
          for(int j = 0; j < RouterSimulator.NUM_NODES; j++)
          {
            // If we route through i to get to j
            if(nextHops[j] == i)
            {
              // Advertise infinite distance to j.
              myGUI.println("REVERSED POISON");
              to_send[j] = RouterSimulator.INFINITY;
            }
          }
        }

        sendUpdate(new RouterPacket(myID, i, to_send));
      }
    }
  }

  //--------------------------------------------------
  private void sendUpdate(RouterPacket pkt)
  {
    sim.toLayer2(pkt);
  }


  //--------------------------------------------------
  public void printDistanceTable()
  {
    myGUI.println("Current table for " + myID +
    "  at time " + sim.getClocktime());

    for(int i = 0; i < costs.length; i++)
    {
      myGUI.print("Min distance to router " + i + ": " + costs[i]);
      myGUI.print(". Use router " + nextHops[i] + "\n");
    }
    myGUI.println("\nNeighbor distance tables:");
    for(int n = 0; n < neighborTables.length; n++)
    {
      for (int i = 0; i < neighborTables[n].length; i++)
      {
        myGUI.print(neighborTables[n][i] + " ");
      }
      myGUI.print("\n");
    }
    myGUI.println("##############################");
  }

  //--------------------------------------------------
  public void updateLinkCost(int dest, int newcost)
  {
    // Change the initial cost so topology is up to date.
    initialCosts[dest] = newcost;
    // Change the same thing at the affected neighbor table.
    neighborTables[dest][myID] = newcost;

    // Send affected neighbor an update on my table.
    sendUpdate(new RouterPacket(myID, dest, costs));
  }
}


// TODO - Do these groups in order.
// Implement constructor # DONE
// Implement recvUpdate() # DONE
// Implement printDistanceTable() # DONE
// TEST ABOVE WITH RouterSimulator4 & RouterSimulator5

// Implement updateLinkCost() # DONE
// TEST ABOVE WITH RouterSimulator3 - This should have count to infinity problem.

// Implement Poisoned Reverse w/ Disable/enable # DONE
// TEST ABOVE WITH RouterSimulator3 - This should fix the count to infinity problem.
