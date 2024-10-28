https://networks.skewed.de/net/elite

# prop_name, value
name,elite
description,"A small bipartite network of the affiliations among elite individuals and the corporate, museum, university boards, or social clubs to which they belonged, from 1962."
citation,"['R. Barnes and T. Burkett, \"Structural redundancy and multiplicity in corporate networks.\" International Network for Social Network Analysis 30(2), 4-20 (2010), https://www.insna.org/PDF/Connections/v30/2010_I-2_P-1-1.pdf']"
url,http://konect.cc/networks/brunson_corporate-leadership
tags,"['Social', 'Affiliation', 'Unweighted']"
konect_meta,"category: Affiliation
code: BC
name: Corporate leaderships
description: Person–company leaderships
entity-names: person,company
extr: brunson
url: https://github.com/corybrunson/triadic
long-description: This bipartite network contains person–company leadership information between companies and 20 corporate directors. The data was collected in 1962. Left nodes represent persons and right nodes represent companies. An edge between a person and a company shows that the person had a leadership position in that company.
relationship-names: leadership
cite: konect:barnes
"
konect_readme,"Corporate leaderships network, part of the Koblenz Network Collection
===========================================================================

This directory contains the TSV and related files of the brunson_corporate-leadership network: This bipartite network contains person–company leadership information between companies and 20 corporate directors. The data was collected in 1962. Left nodes represent persons and right nodes represent companies. An edge between a person and a company shows that the person had a leadership position in that company.


More information about the network is provided here: 
http://konect.cc/networks/brunson_corporate-leadership

Files: 
    meta.brunson_corporate-leadership -- Metadata about the network 
    out.brunson_corporate-leadership -- The adjacency matrix of the network in whitespace-separated values format, with one edge per line
      The meaning of the columns in out.brunson_corporate-leadership are: 
        First column: ID of from node 
        Second column: ID of to node
        Third column (if present): weight or multiplicity of edge
        Fourth column (if present):  timestamp of edges Unix time


Use the following References for citation:

@MISC{konect:2017:brunson_corporate-leadership,
    title = {Corporate leaderships network dataset -- {KONECT}},
    month = oct,
    year = {2017},
    url = {http://konect.cc/networks/brunson_corporate-leadership}
}

@article{konect:barnes,
	title = {Structural Redundancy and Multiplicity in Corporate Networks},
	author = {Barnes, Roy and Burkett, Tracy},
	journal = {Int. Netw. for Soc. Netw. Anal.},
	volume = {30},
	number = {2},
	year = {2010},
}

@article{konect:barnes,
	title = {Structural Redundancy and Multiplicity in Corporate Networks},
	author = {Barnes, Roy and Burkett, Tracy},
	journal = {Int. Netw. for Soc. Netw. Anal.},
	volume = {30},
	number = {2},
	year = {2010},
}


@inproceedings{konect,
	title = {{KONECT} -- {The} {Koblenz} {Network} {Collection}},
	author = {Jérôme Kunegis},
	year = {2013},
	booktitle = {Proc. Int. Conf. on World Wide Web Companion},
	pages = {1343--1350},
	url = {http://dl.acm.org/citation.cfm?id=2488173},
	url_presentation = {https://www.slideshare.net/kunegis/presentationwow},
	url_web = {http://konect.cc/},
	url_citations = {https://scholar.google.com/scholar?cites=7174338004474749050},
}

@inproceedings{konect,
	title = {{KONECT} -- {The} {Koblenz} {Network} {Collection}},
	author = {Jérôme Kunegis},
	year = {2013},
	booktitle = {Proc. Int. Conf. on World Wide Web Companion},
	pages = {1343--1350},
	url = {http://dl.acm.org/citation.cfm?id=2488173},
	url_presentation = {https://www.slideshare.net/kunegis/presentationwow},
	url_web = {http://konect.cc/},
	url_citations = {https://scholar.google.com/scholar?cites=7174338004474749050},
}


"
