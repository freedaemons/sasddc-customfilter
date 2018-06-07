# sasddc-customfilter
Implementing a customizable filter in SAS Viya's VA tool using Data Driven Containers

This scriptlet was written to create a more customizable way to filter datasets in SAS's Visual Analytics tool on Viya.

The original use case was to filter (non-binary) tree structures by number of levels of ancestors and descendents, by traversing the tree. 
The amount of latency introduced by traversal was unacceptable, so a workaround was formed by denormalizing the edgelist to a predefined number of levels by joining it to itself, then traversing that edgelist. This reduces the complexity from O(mn) to O(m), assuming a small number of pregenerated levels (m being the number of edges). 

This approach results in a filter that also works with graphs, including cyclic graphs.

This scriptlet can be modified to filter SAS datasets in Visual Analytics in Viya in any way you can concoct in Javascript. It takes a CAS table into a 2-dimensional array, and returns a list of dictionaries, each dictionary specifying the index of a row in the original dataset that is to be retained. Hence, new columns cannot be introduced, nor can original values be transformed.
